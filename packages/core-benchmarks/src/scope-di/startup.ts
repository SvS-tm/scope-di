import { getRepetitions, getWorkerCommand } from "../isolated-runner.ts";
import { createBenchmarkProgress } from "../progress.ts";
import { runJsonWorker } from "../json-worker.ts";
import
{
    createTransientClassBuilder,
    createTransientFactoryWithFiveDependenciesBuilder,
    createTransientFactoryWithTenDependenciesBuilder,
    createTransientFactoryDeepWideGraphBuilder,
    createCachedFactoryDeepWideGraphBuilder
} from "./resolution.ts";

const workloads =
[
    { name: "transientClass", createBuilder: createTransientClassBuilder },
    { name: "factoryFiveDependencies", createBuilder: createTransientFactoryWithFiveDependenciesBuilder },
    { name: "factoryTenDependencies", createBuilder: createTransientFactoryWithTenDependenciesBuilder },
    { name: "factoryDeepWideGraph", createBuilder: createTransientFactoryDeepWideGraphBuilder },
    { name: "cachedFactoryDeepWideGraph", createBuilder: createCachedFactoryDeepWideGraphBuilder }
];

const configurations =
[
    { name: "scope-di", codeGeneration: false, isolation: false },
    { name: "scope-di-codegen", codeGeneration: true, isolation: false },
    { name: "scope-di-module-reload", codeGeneration: false, isolation: true },
    { name: "scope-di-module-reload-codegen", codeGeneration: true, isolation: true }
];

export type StartupMeasurement =
{
    name: string;
    registrationMilliseconds: number;
    buildMilliseconds: number;
    totalMilliseconds: number;
    processId: number;
};

function measureStartup(name: string): Promise<StartupMeasurement> | StartupMeasurement
{
    const workload = workloads.find(workload => name.endsWith(`:${workload.name}`));
    const configuration = configurations.find(configuration => name.startsWith(`${configuration.name}:`));

    if(!workload || !configuration)
        throw new Error(`Unknown startup case: ${name}`);

    const registrationStartedAt = performance.now();
    const builder = workload.createBuilder(configuration.codeGeneration);
    const registrationFinishedAt = performance.now();
    const scope = configuration.isolation
        ? builder.setAllowRuntimeModuleIsolation(true).build()
        : builder.build();

    const complete = () =>
    {
        const finishedAt = performance.now();

        return {
            name,
            registrationMilliseconds: registrationFinishedAt - registrationStartedAt,
            buildMilliseconds: finishedAt - registrationFinishedAt,
            totalMilliseconds: finishedAt - registrationStartedAt,
            processId: process.pid
        };
    };

    // Keep synchronous build timing free of an artificial await boundary.
    return scope instanceof Promise ? scope.then(complete) : complete();
}

async function runStartupWorker(runtimeArgs: string[], name: string): Promise<StartupMeasurement>
{
    const command = getWorkerCommand(runtimeArgs, name);

    return runJsonWorker
    (
        command,
        name,
        (value) =>
        {
            const measurement = value as StartupMeasurement;
            const times =
            [
                measurement.registrationMilliseconds,
                measurement.buildMilliseconds,
                measurement.totalMilliseconds
            ];

            if(measurement.name !== name || !times.every(time => Number.isFinite(time) && time >= 0))
                throw new Error("Invalid startup measurement.");

            return measurement;
        }
    );
}

export async function runStartupBenchmarks(runtimeArgs: string[])
{
    const workerCase = runtimeArgs.find(argument => argument.startsWith("--case="))?.slice("--case=".length);

    if(workerCase !== undefined)
    {
        const originalWarn = console.warn;
        const warnings: unknown[][] = [];
        console.warn = (...parameters: unknown[]) =>
        {
            warnings.push(parameters);
            originalWarn(...parameters);
        };

        try
        {
            const measurement = await measureStartup(workerCase);

            if(warnings.length > 0)
                throw new Error(`Startup ${workerCase} emitted warnings; refusing to report a fallback.`);

            return measurement;
        }
        finally
        {
            console.warn = originalWarn;
        }
    }

    const names = workloads.flatMap(workload => configurations.map(configuration => `${configuration.name}:${workload.name}`));
    const repetitions = getRepetitions(runtimeArgs);
    const measurements: StartupMeasurement[] = [];
    const progress = createBenchmarkProgress(runtimeArgs, names.length * repetitions);

    // One build per process: unique isolation modules are retained by the runtime.
    for(let repetition = 0; repetition < repetitions; ++repetition)
    {
        const orderedNames = repetition % 2 === 0 ? names : names.slice().reverse();

        for(const name of orderedNames)
        {
            const measurement = await progress.measure
            (
                `startup ${name} (repetition ${repetition + 1}/${repetitions})`,
                () => runStartupWorker(runtimeArgs, name)
            );
            measurements.push(measurement);
        }
    }

    return { kind: "single-build-per-process", repetitions, measurements };
}
