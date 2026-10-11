// deno-lint-ignore-file no-sloppy-imports
import os from "node:os";
import { execFileSync } from "node:child_process";
import * as scopeDiRegistration from "./scope-di/registration.ts";
import * as scopeDiResolution from "./scope-di/resolution.ts";
import * as scopeDiDiagnostics from "./scope-di/diagnostics.ts";
import * as inversifyRegistration from "./inversify/registration.ts";
import * as inversifyResolution from "./inversify/resolution.ts";
import * as tsyringeRegistration from "./tsyringe/registration.ts";
import * as tsyringeResolution from "./tsyringe/resolution.ts";
import * as awilixRegistration from "./awilix/registration.ts";
import * as awilixResolution from "./awilix/resolution.ts";
import * as typediRegistration from "./typedi/registration.ts";
import * as typediResolution from "./typedi/resolution.ts";
import * as typedInjectRegistration from "./typed-inject/registration.ts";
import * as typedInjectResolution from "./typed-inject/resolution.ts";
import * as needleDiRegistration from "./needle-di/registration.ts";
import * as needleDiResolution from "./needle-di/resolution.ts";
import { bench, boxplot, summary, run, group, type k_state } from "mitata";
import { getProcessContext, getRepetitions, runIsolatedBenchmarks } from "./isolated-runner.ts";
import { libraryNames } from "./libraries.ts";

type BenchmarkAction = (state: k_state) => Generator<unknown, void, unknown>;

type BenchmarkRun =
{
    name: string;
    action: BenchmarkAction;
    baseline: boolean;
    codeGeneration?: boolean;
};

type BenchmarkMode = "fast" | "complete";

type BenchmarkGroup =
{
    name: string;
    runs: BenchmarkRun[];
    modes?: BenchmarkMode[];
};

type BenchmarkActions =
{
    scopeDi: BenchmarkAction;
    inversify: BenchmarkAction;
    tsyringe: BenchmarkAction;
    awilix: BenchmarkAction;
    typedi: BenchmarkAction;
    typedInject: BenchmarkAction;
    needleDi?: BenchmarkAction;
};

type BenchmarkLibraryConfiguration =
{
    key: keyof BenchmarkActions;
    name: string;
    baseline?: boolean;
    codeGeneration?: boolean[];
    codeGenerationName?: string;
};

const libraryConfigurations: BenchmarkLibraryConfiguration[] =
[
    { key: "scopeDi", name: "scope-di", baseline: true, codeGeneration: [false, true] },
    { key: "inversify", name: "inversify", codeGeneration: [false, true], codeGenerationName: "inversify-jit" },
    { key: "tsyringe", name: "tsyringe" },
    { key: "awilix", name: "awilix" },
    { key: "typedi", name: "typedi" },
    { key: "typedInject", name: "typed-inject" },
    { key: "needleDi", name: "needle-di" }
];

function createRuns(benchmarkName: string, actions: BenchmarkActions): BenchmarkRun[]
{
    const runs: BenchmarkRun[] = [];

    for (const library of libraryConfigurations)
    {
        const action = actions[library.key];

        if (!action)
            continue;

        for (const codeGeneration of library.codeGeneration ?? [undefined])
        {
            const name = codeGeneration === true
                ? library.codeGenerationName ?? `${library.name}-codegen`
                : library.name;

            runs.push
            (
                {
                    name: `${name}:${benchmarkName}`,
                    action,
                    baseline: library.baseline === true && codeGeneration !== true,
                    ...(codeGeneration === undefined ? {} : { codeGeneration })
                }
            );
        }
    }

    return runs;
}

function getRuntimeArgs()
{
    const args = (globalThis as { process?: { argv?: string[] }; Deno?: { args?: string[] } });

    return args.Deno?.args ?? args.process?.argv ?? [];
}

function getOutputFormat(runtimeArgs: string[])
{
    return runtimeArgs.includes("--json")
        ? "json" as const
        : "mitata" as const;
}

function getFilter(runtimeArgs: string[])
{
    const filterArgument = runtimeArgs.find((argument) => argument.startsWith("--filter="));

    if (!filterArgument)
        return undefined;

    return new RegExp(escapeRegExp(filterArgument.slice("--filter=".length)));
}

function escapeRegExp(value: string)
{
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getIterations(runtimeArgs: string[])
{
    const iterationsArgument = runtimeArgs.find((argument) => argument.startsWith("--iterations="));

    if(!iterationsArgument)
        return 300;

    const iterations = Number(iterationsArgument.slice("--iterations=".length));

    if(!Number.isSafeInteger(iterations) || iterations <= 0)
        throw new Error(`Invalid benchmark iterations count: ${iterationsArgument}`);

    return iterations;
}

function getMode(runtimeArgs: string[])
    : BenchmarkMode
{
    const modeArgument = runtimeArgs.find((argument) => argument.startsWith("--mode="));

    if(!modeArgument)
        return "complete";

    const mode = modeArgument.slice("--mode=".length);

    if(mode === "fast" || mode === "complete")
        return mode;

    throw new Error(`Unknown benchmark mode: ${mode}`);
}

function getRuntimeName()
{
    const runtime = globalThis as
    {
        Bun?: { version?: string };
        Deno?: { version?: { deno: string; v8: string; typescript: string } };
        process?: { versions?: NodeJS.ProcessVersions };
    };

    if(runtime.Bun)
        return "bun";

    if(runtime.Deno)
        return "deno";

    if(runtime.process)
        return "node";

    return "unknown";
}

function getBestEffortValue<T>(getValue: () => T, fallback: T)
{
    try
    {
        return getValue();
    }
    catch
    {
        return fallback;
    }
}

function getGitValue(args: string[])
{
    return execFileSync
    (
        "git",
        args,
        {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"]
        }
    )
        .trim();
}

function getSanityCheckDetails(command: string, details: unknown)
{
    const detailMessage = details instanceof Error
        ? details.message
        : String(details);

    return `${command}: ${detailMessage}`;
}

function throwSanityCheckError(messages: string[], command: string, details: unknown)
    : never
{
    throw new Error
    (
        [
            ...messages,
            getSanityCheckDetails(command, details)
        ].join("\n")
    );
}

function assertGitAvailable()
{
    try
    {
        getGitValue(["--version"]);
    }
    catch(error)
    {
        throwSanityCheckError
        (
            [
                "Benchmark sanity check failed: git is required before running benchmarks.",
                "Install Git and make sure the `git` executable is available on PATH.",
                "When running with Deno, also make sure the command includes `--allow-env --allow-run`."
            ],
            "git --version",
            error
        );
    }
}

function assertGitRepository()
{
    try
    {
        const isInsideWorkTree = getGitValue(["rev-parse", "--is-inside-work-tree"]);

        if(isInsideWorkTree !== "true")
            throw new Error(`Expected true, received ${isInsideWorkTree}`);
    }
    catch(error)
    {
        throwSanityCheckError
        (
            [
                "Benchmark sanity check failed: benchmarks must run from inside a Git work tree.",
                "Run the benchmark from the repository checkout so source metadata can be recorded."
            ],
            "git rev-parse --is-inside-work-tree",
            error
        );
    }
}

function assertGitCommitReadable()
{
    try
    {
        getGitValue(["rev-parse", "--verify", "HEAD"]);
    }
    catch(error)
    {
        throwSanityCheckError
        (
            [
                "Benchmark sanity check failed: current Git commit could not be read.",
                "Make sure the checkout has a valid HEAD before running benchmarks."
            ],
            "git rev-parse --verify HEAD",
            error
        );
    }
}

function assertBenchmarkSanityChecks()
{
    assertGitAvailable();
    assertGitRepository();
    assertGitCommitReadable();
}

function createSourceMetadata()
{
    const repository = getBestEffortValue(() => getGitValue(["remote", "get-url", "origin"]), undefined as string | undefined);
    const commit = getBestEffortValue(() => getGitValue(["rev-parse", "HEAD"]), undefined as string | undefined);
    const shortCommit = getBestEffortValue(() => getGitValue(["rev-parse", "--short", "HEAD"]), undefined as string | undefined);
    const branch = getBestEffortValue(() => getGitValue(["rev-parse", "--abbrev-ref", "HEAD"]), undefined as string | undefined);

    return {
        repository,
        commit,
        shortCommit,
        branch
    };
}

function createBenchmarkMetadata(mode: BenchmarkMode, filter: RegExp | undefined, outputFormat: "json" | "mitata", iterations: number)
{
    const runtime = globalThis as
    {
        Bun?: { version?: string };
        Deno?: { version?: { deno: string; v8: string; typescript: string } };
        process?: { version?: string; versions?: NodeJS.ProcessVersions };
    };

    const cpus = getBestEffortValue(() => os.cpus(), [] as ReturnType<typeof os.cpus>);
    const firstCpu = cpus[0];

    return {
        benchmark: {
            mode,
            isolation: "case",
            repetitions: getRepetitions(runtimeArgs),
            library: runtimeArgs.find(argument => argument.startsWith("--library="))?.slice("--library=".length),
            filter: filter?.source,
            iterations,
            outputFormat,
            timestamp: new Date().toISOString()
        },
        source: createSourceMetadata(),
        runtime: {
            name: getRuntimeName(),
            node: runtime.process?.version,
            bun: runtime.Bun?.version,
            deno: runtime.Deno?.version,
            versions: runtime.process?.versions
        },
        machine: {
            platform: getBestEffortValue(() => os.platform(), "unknown"),
            release: getBestEffortValue(() => os.release(), "unknown"),
            arch: getBestEffortValue(() => os.arch(), "unknown"),
            hostname: getBestEffortValue(() => os.hostname(), "unknown"),
            cpu:
            {
                model: firstCpu?.model,
                speed: firstCpu?.speed,
                count: cpus.length
            },
            memory:
            {
                total: getBestEffortValue(() => os.totalmem(), undefined as number | undefined),
                free: getBestEffortValue(() => os.freemem(), undefined as number | undefined)
            }
        }
    };
}

const benchmarks = 
[
    {
        name: "registrationClass",
        runs: createRuns
        (
            "registrationClass",
            {
                scopeDi: scopeDiRegistration.registrationClass,
                inversify: inversifyRegistration.registrationClass,
                tsyringe: tsyringeRegistration.registrationClass,
                awilix: awilixRegistration.registrationClass,
                typedi: typediRegistration.registrationClass,
                typedInject: typedInjectRegistration.registrationClass,
                needleDi: needleDiRegistration.registrationClass
            }
        )
    },
    {
        name: "registrationValue",
        runs: createRuns
        (
            "registrationValue",
            {
                scopeDi: scopeDiRegistration.registrationValue,
                inversify: inversifyRegistration.registrationValue,
                tsyringe: tsyringeRegistration.registrationValue,
                awilix: awilixRegistration.registrationValue,
                typedi: typediRegistration.registrationValue,
                typedInject: typedInjectRegistration.registrationValue,
                needleDi: needleDiRegistration.registrationValue
            }
        )
    },
    {
        name: "registrationFactory",
        runs: createRuns
        (
            "registrationFactory",
            {
                scopeDi: scopeDiRegistration.registrationFactory,
                inversify: inversifyRegistration.registrationFactory,
                tsyringe: tsyringeRegistration.registrationFactory,
                awilix: awilixRegistration.registrationFactory,
                typedi: typediRegistration.registrationFactory,
                typedInject: typedInjectRegistration.registrationFactory,
                needleDi: needleDiRegistration.registrationFactory
            }
        )
    },
    {
        name: "warmResolveValue",
        modes: ["fast", "complete"],
        runs: createRuns
        (
            "warmResolveValue",
            {
                scopeDi: scopeDiResolution.warmResolveValue,
                inversify: inversifyResolution.warmResolveValue,
                tsyringe: tsyringeResolution.warmResolveValue,
                awilix: awilixResolution.warmResolveValue,
                typedi: typediResolution.warmResolveValue,
                typedInject: typedInjectResolution.warmResolveValue,
                needleDi: needleDiResolution.warmResolveValue
            }
        )
    },
    {
        name: "coldResolveValue",
        modes: ["complete"],
        runs: createRuns
        (
            "coldResolveValue",
            {
                scopeDi: scopeDiResolution.coldResolveValue,
                inversify: inversifyResolution.coldResolveValue,
                tsyringe: tsyringeResolution.coldResolveValue,
                awilix: awilixResolution.coldResolveValue,
                typedi: typediResolution.coldResolveValue,
                typedInject: typedInjectResolution.coldResolveValue,
                needleDi: needleDiResolution.coldResolveValue
            }
        )
    },
    {
        name: "warmResolveSingletonClass",
        modes: ["fast", "complete"],
        runs: createRuns
        (
            "warmResolveSingletonClass",
            {
                scopeDi: scopeDiResolution.warmResolveSingletonClass,
                inversify: inversifyResolution.warmResolveSingletonClass,
                tsyringe: tsyringeResolution.warmResolveSingletonClass,
                awilix: awilixResolution.warmResolveSingletonClass,
                typedi: typediResolution.warmResolveSingletonClass,
                typedInject: typedInjectResolution.warmResolveSingletonClass,
                needleDi: needleDiResolution.warmResolveSingletonClass
            }
        )
    },
    {
        name: "coldResolveSingletonClass",
        modes: ["complete"],
        runs: createRuns
        (
            "coldResolveSingletonClass",
            {
                scopeDi: scopeDiResolution.coldResolveSingletonClass,
                inversify: inversifyResolution.coldResolveSingletonClass,
                tsyringe: tsyringeResolution.coldResolveSingletonClass,
                awilix: awilixResolution.coldResolveSingletonClass,
                typedi: typediResolution.coldResolveSingletonClass,
                typedInject: typedInjectResolution.coldResolveSingletonClass,
                needleDi: needleDiResolution.coldResolveSingletonClass
            }
        )
    },
    {
        name: "warmResolveTransientClass",
        runs: createRuns
        (
            "warmResolveTransientClass",
            {
                scopeDi: scopeDiResolution.warmResolveTransientClass,
                inversify: inversifyResolution.warmResolveTransientClass,
                tsyringe: tsyringeResolution.warmResolveTransientClass,
                awilix: awilixResolution.warmResolveTransientClass,
                typedi: typediResolution.warmResolveTransientClass,
                typedInject: typedInjectResolution.warmResolveTransientClass
            }
        )
    },
    {
        name: "coldResolveTransientClass",
        runs: createRuns
        (
            "coldResolveTransientClass",
            {
                scopeDi: scopeDiResolution.coldResolveTransientClass,
                inversify: inversifyResolution.coldResolveTransientClass,
                tsyringe: tsyringeResolution.coldResolveTransientClass,
                awilix: awilixResolution.coldResolveTransientClass,
                typedi: typediResolution.coldResolveTransientClass,
                typedInject: typedInjectResolution.coldResolveTransientClass
            }
        )
    },
    {
        name: "warmResolveSingletonFactory",
        runs: createRuns
        (
            "warmResolveSingletonFactory",
            {
                scopeDi: scopeDiResolution.warmResolveSingletonFactory,
                inversify: inversifyResolution.warmResolveSingletonFactory,
                tsyringe: tsyringeResolution.warmResolveSingletonFactory,
                awilix: awilixResolution.warmResolveSingletonFactory,
                typedi: typediResolution.warmResolveSingletonFactory,
                typedInject: typedInjectResolution.warmResolveSingletonFactory,
                needleDi: needleDiResolution.warmResolveSingletonFactory
            }
        )
    },
    {
        name: "coldResolveSingletonFactory",
        runs: createRuns
        (
            "coldResolveSingletonFactory",
            {
                scopeDi: scopeDiResolution.coldResolveSingletonFactory,
                inversify: inversifyResolution.coldResolveSingletonFactory,
                tsyringe: tsyringeResolution.coldResolveSingletonFactory,
                awilix: awilixResolution.coldResolveSingletonFactory,
                typedi: typediResolution.coldResolveSingletonFactory,
                typedInject: typedInjectResolution.coldResolveSingletonFactory,
                needleDi: needleDiResolution.coldResolveSingletonFactory
            }
        )
    },
    {
        name: "warmResolveTransientFactory",
        runs: createRuns
        (
            "warmResolveTransientFactory",
            {
                scopeDi: scopeDiResolution.warmResolveTransientFactory,
                inversify: inversifyResolution.warmResolveTransientFactory,
                tsyringe: tsyringeResolution.warmResolveTransientFactory,
                awilix: awilixResolution.warmResolveTransientFactory,
                typedi: typediResolution.warmResolveTransientFactory,
                typedInject: typedInjectResolution.warmResolveTransientFactory
            }
        )
    },
    {
        name: "coldResolveTransientFactory",
        runs: createRuns
        (
            "coldResolveTransientFactory",
            {
                scopeDi: scopeDiResolution.coldResolveTransientFactory,
                inversify: inversifyResolution.coldResolveTransientFactory,
                tsyringe: tsyringeResolution.coldResolveTransientFactory,
                awilix: awilixResolution.coldResolveTransientFactory,
                typedi: typediResolution.coldResolveTransientFactory,
                typedInject: typedInjectResolution.coldResolveTransientFactory
            }
        )
    },
    {
        name: "warmResolveTransientFactoryChain",
        runs: createRuns
        (
            "warmResolveTransientFactoryChain",
            {
                scopeDi: scopeDiResolution.warmResolveTransientFactoryChain,
                inversify: inversifyResolution.warmResolveTransientFactoryChain,
                tsyringe: tsyringeResolution.warmResolveTransientFactoryChain,
                awilix: awilixResolution.warmResolveTransientFactoryChain,
                typedi: typediResolution.warmResolveTransientFactoryChain,
                typedInject: typedInjectResolution.warmResolveTransientFactoryChain
            }
        )
    },
    {
        name: "coldResolveTransientFactoryChain",
        runs: createRuns
        (
            "coldResolveTransientFactoryChain",
            {
                scopeDi: scopeDiResolution.coldResolveTransientFactoryChain,
                inversify: inversifyResolution.coldResolveTransientFactoryChain,
                tsyringe: tsyringeResolution.coldResolveTransientFactoryChain,
                awilix: awilixResolution.coldResolveTransientFactoryChain,
                typedi: typediResolution.coldResolveTransientFactoryChain,
                typedInject: typedInjectResolution.coldResolveTransientFactoryChain
            }
        )
    },
    {
        name: "warmResolveTransientFactoryWithFiveDependencies",
        modes: ["fast", "complete"],
        runs: createRuns
        (
            "warmResolveTransientFactoryWithFiveDependencies",
            {
                scopeDi: scopeDiResolution.warmResolveTransientFactoryWithFiveDependencies,
                inversify: inversifyResolution.warmResolveTransientFactoryWithFiveDependencies,
                tsyringe: tsyringeResolution.warmResolveTransientFactoryWithFiveDependencies,
                awilix: awilixResolution.warmResolveTransientFactoryWithFiveDependencies,
                typedi: typediResolution.warmResolveTransientFactoryWithFiveDependencies,
                typedInject: typedInjectResolution.warmResolveTransientFactoryWithFiveDependencies
            }
        )
    },
    {
        name: "coldResolveTransientFactoryWithFiveDependencies",
        modes: ["complete"],
        runs: createRuns
        (
            "coldResolveTransientFactoryWithFiveDependencies",
            {
                scopeDi: scopeDiResolution.coldResolveTransientFactoryWithFiveDependencies,
                inversify: inversifyResolution.coldResolveTransientFactoryWithFiveDependencies,
                tsyringe: tsyringeResolution.coldResolveTransientFactoryWithFiveDependencies,
                awilix: awilixResolution.coldResolveTransientFactoryWithFiveDependencies,
                typedi: typediResolution.coldResolveTransientFactoryWithFiveDependencies,
                typedInject: typedInjectResolution.coldResolveTransientFactoryWithFiveDependencies
            }
        )
    },
    {
        name: "warmResolveTransientFactoryWithSixDependencies",
        modes: ["fast", "complete"],
        runs: createRuns
        (
            "warmResolveTransientFactoryWithSixDependencies",
            {
                scopeDi: scopeDiResolution.warmResolveTransientFactoryWithSixDependencies,
                inversify: inversifyResolution.warmResolveTransientFactoryWithSixDependencies,
                tsyringe: tsyringeResolution.warmResolveTransientFactoryWithSixDependencies,
                awilix: awilixResolution.warmResolveTransientFactoryWithSixDependencies,
                typedi: typediResolution.warmResolveTransientFactoryWithSixDependencies,
                typedInject: typedInjectResolution.warmResolveTransientFactoryWithSixDependencies
            }
        )
    },
    {
        name: "coldResolveTransientFactoryWithSixDependencies",
        modes: ["complete"],
        runs: createRuns
        (
            "coldResolveTransientFactoryWithSixDependencies",
            {
                scopeDi: scopeDiResolution.coldResolveTransientFactoryWithSixDependencies,
                inversify: inversifyResolution.coldResolveTransientFactoryWithSixDependencies,
                tsyringe: tsyringeResolution.coldResolveTransientFactoryWithSixDependencies,
                awilix: awilixResolution.coldResolveTransientFactoryWithSixDependencies,
                typedi: typediResolution.coldResolveTransientFactoryWithSixDependencies,
                typedInject: typedInjectResolution.coldResolveTransientFactoryWithSixDependencies
            }
        )
    },
    {
        name: "warmResolveTransientFactoryDeepChain",
        modes: ["fast", "complete"],
        runs: createRuns
        (
            "warmResolveTransientFactoryDeepChain",
            {
                scopeDi: scopeDiResolution.warmResolveTransientFactoryDeepChain,
                inversify: inversifyResolution.warmResolveTransientFactoryDeepChain,
                tsyringe: tsyringeResolution.warmResolveTransientFactoryDeepChain,
                awilix: awilixResolution.warmResolveTransientFactoryDeepChain,
                typedi: typediResolution.warmResolveTransientFactoryDeepChain,
                typedInject: typedInjectResolution.warmResolveTransientFactoryDeepChain
            }
        )
    },
    {
        name: "coldResolveTransientFactoryDeepChain",
        modes: ["complete"],
        runs: createRuns
        (
            "coldResolveTransientFactoryDeepChain",
            {
                scopeDi: scopeDiResolution.coldResolveTransientFactoryDeepChain,
                inversify: inversifyResolution.coldResolveTransientFactoryDeepChain,
                tsyringe: tsyringeResolution.coldResolveTransientFactoryDeepChain,
                awilix: awilixResolution.coldResolveTransientFactoryDeepChain,
                typedi: typediResolution.coldResolveTransientFactoryDeepChain,
                typedInject: typedInjectResolution.coldResolveTransientFactoryDeepChain
            }
        )
    },
    {
        name: "warmResolveTransientFactoryWithTenDependencies",
        modes: ["fast", "complete"],
        runs: createRuns
        (
            "warmResolveTransientFactoryWithTenDependencies",
            {
                scopeDi: scopeDiResolution.warmResolveTransientFactoryWithTenDependencies,
                inversify: inversifyResolution.warmResolveTransientFactoryWithTenDependencies,
                tsyringe: tsyringeResolution.warmResolveTransientFactoryWithTenDependencies,
                awilix: awilixResolution.warmResolveTransientFactoryWithTenDependencies,
                typedi: typediResolution.warmResolveTransientFactoryWithTenDependencies,
                typedInject: typedInjectResolution.warmResolveTransientFactoryWithTenDependencies
            }
        )
    },
    {
        name: "coldResolveTransientFactoryWithTenDependencies",
        modes: ["complete"],
        runs: createRuns
        (
            "coldResolveTransientFactoryWithTenDependencies",
            {
                scopeDi: scopeDiResolution.coldResolveTransientFactoryWithTenDependencies,
                inversify: inversifyResolution.coldResolveTransientFactoryWithTenDependencies,
                tsyringe: tsyringeResolution.coldResolveTransientFactoryWithTenDependencies,
                awilix: awilixResolution.coldResolveTransientFactoryWithTenDependencies,
                typedi: typediResolution.coldResolveTransientFactoryWithTenDependencies,
                typedInject: typedInjectResolution.coldResolveTransientFactoryWithTenDependencies
            }
        )
    },
    {
        name: "warmResolveTransientFactoryDeepWideGraph",
        modes: ["fast", "complete"],
        runs: createRuns
        (
            "warmResolveTransientFactoryDeepWideGraph",
            {
                scopeDi: scopeDiResolution.warmResolveTransientFactoryDeepWideGraph,
                inversify: inversifyResolution.warmResolveTransientFactoryDeepWideGraph,
                tsyringe: tsyringeResolution.warmResolveTransientFactoryDeepWideGraph,
                awilix: awilixResolution.warmResolveTransientFactoryDeepWideGraph,
                typedi: typediResolution.warmResolveTransientFactoryDeepWideGraph,
                typedInject: typedInjectResolution.warmResolveTransientFactoryDeepWideGraph
            }
        )
    },
    {
        name: "coldResolveTransientFactoryDeepWideGraph",
        modes: ["complete"],
        runs: createRuns
        (
            "coldResolveTransientFactoryDeepWideGraph",
            {
                scopeDi: scopeDiResolution.coldResolveTransientFactoryDeepWideGraph,
                inversify: inversifyResolution.coldResolveTransientFactoryDeepWideGraph,
                tsyringe: tsyringeResolution.coldResolveTransientFactoryDeepWideGraph,
                awilix: awilixResolution.coldResolveTransientFactoryDeepWideGraph,
                typedi: typediResolution.coldResolveTransientFactoryDeepWideGraph,
                typedInject: typedInjectResolution.coldResolveTransientFactoryDeepWideGraph
            }
        )
    },
    {
        name: "warmResolveCachedFactoryWideGraph",
        modes: ["fast", "complete"],
        runs: createRuns
        (
            "warmResolveCachedFactoryWideGraph",
            {
                scopeDi: scopeDiResolution.warmResolveCachedFactoryWideGraph,
                inversify: inversifyResolution.warmResolveCachedFactoryWideGraph,
                tsyringe: tsyringeResolution.warmResolveCachedFactoryWideGraph,
                awilix: awilixResolution.warmResolveCachedFactoryWideGraph,
                typedi: typediResolution.warmResolveCachedFactoryWideGraph,
                typedInject: typedInjectResolution.warmResolveCachedFactoryWideGraph
            }
        )
    },
    {
        name: "warmResolveCachedFactoryDeepWideGraph",
        modes: ["fast", "complete"],
        runs: createRuns
        (
            "warmResolveCachedFactoryDeepWideGraph",
            {
                scopeDi: scopeDiResolution.warmResolveCachedFactoryDeepWideGraph,
                inversify: inversifyResolution.warmResolveCachedFactoryDeepWideGraph,
                tsyringe: tsyringeResolution.warmResolveCachedFactoryDeepWideGraph,
                awilix: awilixResolution.warmResolveCachedFactoryDeepWideGraph,
                typedi: typediResolution.warmResolveCachedFactoryDeepWideGraph,
                typedInject: typedInjectResolution.warmResolveCachedFactoryDeepWideGraph
            }
        )
    },
    {
        name: "diagnostics:scope-di",
        modes: ["fast", "complete"],
        runs:
        [
            {
                name: "diagnostics:scope-di:registryResolveSingleDescriptor",
                action: scopeDiDiagnostics.registryResolveSingleDescriptor,
                baseline: true
            },
            {
                name: "diagnostics:scope-di:registryResolveCollectionDescriptors",
                action: scopeDiDiagnostics.registryResolveCollectionDescriptors,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:findResolvedSingletonMiss",
                action: scopeDiDiagnostics.findResolvedSingletonMiss,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:findResolvedSingletonHit",
                action: scopeDiDiagnostics.findResolvedSingletonHit,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:findResolvedTransient",
                action: scopeDiDiagnostics.findResolvedTransient,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:resolveNoKeys",
                action: scopeDiDiagnostics.resolveNoKeys,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:resolveCachedValue",
                action: scopeDiDiagnostics.resolveCachedValue,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:resolveColdValue",
                action: scopeDiDiagnostics.resolveColdValue,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:findResolvedValueMiss",
                action: scopeDiDiagnostics.findResolvedValueMiss,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:findResolvedValueHit",
                action: scopeDiDiagnostics.findResolvedValueHit,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:resolveCachedThreeValues",
                action: scopeDiDiagnostics.resolveCachedThreeValues,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:resolveCachedFiveValues",
                action: scopeDiDiagnostics.resolveCachedFiveValues,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:resolveCachedSixValues",
                action: scopeDiDiagnostics.resolveCachedSixValues,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:resolveCollectionValues",
                action: scopeDiDiagnostics.resolveCollectionValues,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:resolveTransientFactoryWithFiveDependencies",
                action: scopeDiDiagnostics.resolveTransientFactoryWithFiveDependencies,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:resolveTransientFactoryWithSixDependencies",
                action: scopeDiDiagnostics.resolveTransientFactoryWithSixDependencies,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:createChildScope",
                action: scopeDiDiagnostics.createChildScope,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:disposeEmptyScope",
                action: scopeDiDiagnostics.disposeEmptyScope,
                baseline: false
            },
            {
                name: "diagnostics:scope-di:disposeResolvedSingleton",
                action: scopeDiDiagnostics.disposeResolvedSingleton,
                baseline: false
            }
        ]
    }
] satisfies BenchmarkGroup[];

const runtimeArgs = getRuntimeArgs();
assertBenchmarkSanityChecks();
const mode = getMode(runtimeArgs);
const iterations = [getIterations(runtimeArgs)];
const outputFormat = getOutputFormat(runtimeArgs);
const filter = getFilter(runtimeArgs);
const workerCase = runtimeArgs.find(argument => argument.startsWith("--case="))?.slice("--case=".length);
const selectedLibrary = runtimeArgs.find(argument => argument.startsWith("--library="))?.slice("--library=".length);

if(selectedLibrary !== undefined && !libraryNames.some(library => library === selectedLibrary))
    throw new Error(`Unknown benchmark library: ${selectedLibrary}`);
const selectedBenchmarks = benchmarks.filter
(
    ({ modes }) =>
    {
        if(mode === "complete")
            return !modes || modes.includes(mode);

        return modes?.includes(mode) ?? false;
    }
);

async function executeBenchmarks()
{
    if(workerCase === undefined)
    {
        const names = selectedBenchmarks.flatMap(({ runs }) => runs.map(({ name }) => name))
            .filter(name => !filter || filter.test(name))
            .filter
            (
                name => selectedLibrary === undefined
                    || name.startsWith(`${selectedLibrary}:`)
                    || name.startsWith(`${selectedLibrary}-codegen:`)
                    || (selectedLibrary === "inversify" && name.startsWith("inversify-jit:"))
                    || (selectedLibrary === "scope-di" && name.startsWith("diagnostics:scope-di:"))
            );
        if(runtimeArgs.includes("--list-cases"))
        {
            console.log(JSON.stringify(names));
            return;
        }

        const result = await runIsolatedBenchmarks(names, runtimeArgs);
        const metadata = createBenchmarkMetadata(mode, filter, outputFormat, iterations[0]);

        if(outputFormat === "json")
            console.log(JSON.stringify({ ...result, metadata }));
        else
        {
            for(const { name, runs } of selectedBenchmarks)
            {
                const entries = result.benchmarks.filter(benchmark => runs.some(run => run.name === benchmark.alias));

                if(entries.length === 0)
                    continue;

                console.log(`\n${name}`);
                console.table
                (
                    entries.map
                    (
                        benchmark =>
                        {
                            const summary = benchmark.summary;

                            return {
                                case: benchmark.alias,
                                repetitions: summary.repetitions,
                                "median of medians (ns)": summary.median,
                                "minimum median (ns)": summary.minimumMedian,
                                "maximum median (ns)": summary.maximumMedian,
                                "median allocations (bytes)": summary.allocations
                            };
                        }
                    )
                );
            }
        }

        return;
    }

    if(!selectedBenchmarks.some(({ runs }) => runs.some(({ name }) => name === workerCase)))
        throw new Error(`Unknown benchmark case for ${mode} mode: ${workerCase}`);

    for(const { name, runs } of selectedBenchmarks)
    {
        group
        (
            name,
            () =>
            {
                boxplot
                (
                    () =>
                    {
                        summary
                        (
                            () =>
                            {
                                for(const { name, action, baseline, codeGeneration } of runs)
                                {
                                    bench(name, action)
                                        .gc("inner")
                                        .baseline(baseline)
                                        .args
                                        (
                                            codeGeneration === undefined
                                                ? { iterations }
                                                : { iterations, codeGeneration: [codeGeneration] }
                                        );
                                }
                            }
                        );
                    }
                );
            }
        );
    }

    const metadata = createBenchmarkMetadata(mode, filter, outputFormat, iterations[0]);

    const result = await run
    (
        { colors: false, format: "quiet", throw: true, filter: new RegExp(`^${escapeRegExp(workerCase)}$`) }
    );

    console.log(JSON.stringify({ metadata, ...result, context: getProcessContext(result.context) }));
}

await executeBenchmarks();
