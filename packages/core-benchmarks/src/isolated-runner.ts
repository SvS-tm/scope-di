import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { run } from "mitata";

type MitataResult = Awaited<ReturnType<typeof run>>;
type BenchmarkResult = Omit<MitataResult, "context"> & { context: ReturnType<typeof getProcessContext> };
type BenchmarkTrial = BenchmarkResult["benchmarks"][number];
type ProcessRun = BenchmarkTrial["runs"][number] & { context: ReturnType<typeof getProcessContext>; file: string };

export function getProcessContext(context: MitataResult["context"])
{
    // Calibration sample arrays are unrelated to the case and multiply aggregate size across workers.
    const { now, arch, runtime, cpu } = context;
    const version = (context as typeof context & { version?: string }).version;

    return { now, arch, version, runtime, cpu, processId: process.pid };
}

export type ProcessSummary =
{
    repetitions: number;
    median: number;
    minimumMedian: number;
    maximumMedian: number;
    allocations: number | null;
};

export function getRepetitions(runtimeArgs: string[])
{
    const argument = runtimeArgs.find(argument => argument.startsWith("--repetitions="));
    const repetitions = argument === undefined ? 5 : Number(argument.slice("--repetitions=".length));

    if(!Number.isSafeInteger(repetitions) || repetitions <= 0)
        throw new Error(`Invalid benchmark repetitions count: ${argument}`);

    return repetitions;
}

function median(values: number[])
{
    const sorted = values.slice().sort((left, right) => left - right);
    const middle = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0 ? (sorted[middle - 1]! + sorted[middle]!) / 2 : sorted[middle]!;
}

function summarize(runs: ProcessRun[]): ProcessSummary
{
    const medians = runs.map(run => run.stats!.p50);
    const allocations = runs.map(run => run.stats?.heap?.avg).filter
    (
        (value): value is number => value !== undefined && Number.isFinite(value)
    );

    return {
        repetitions: runs.length,
        median: median(medians),
        minimumMedian: Math.min(...medians),
        maximumMedian: Math.max(...medians),
        allocations: allocations.length === runs.length ? median(allocations) : null
    };
}

function getWorkerCommand(runtimeArgs: string[], name: string)
{
    const entryPoint = fileURLToPath(new URL("./main.ts", import.meta.url));
    const benchmarkArgs = runtimeArgs.filter
    (
        argument => argument.startsWith("--mode=") || argument.startsWith("--iterations=")
    );
    benchmarkArgs.push("--json", "--repetitions=1", `--case=${name}`);

    const runtime = globalThis as
    {
        Deno?: { execPath(): string };
        Bun?: { version: string };
    };

    if (runtime.Deno)
    {
        return {
            executable: runtime.Deno.execPath(),
            args: [
                "run", "--allow-sys", "--allow-env", "--allow-run=git",
                `--import-map=${fileURLToPath(new URL("../deno.json", import.meta.url))}`,
                "--v8-flags=--expose-gc", entryPoint, ...benchmarkArgs
            ]
        };
    }

    if (runtime.Bun)
    {
        return {
            executable: process.execPath,
            args: [
                "--tsconfig-override", fileURLToPath(new URL("../tsconfig.build.json", import.meta.url)),
                "--expose-gc", entryPoint, ...benchmarkArgs
            ]
        };
    }

    // Preserve Node's tsx loader and runtime flags without going through package-manager shims.
    return { executable: process.execPath, args: [...process.execArgv, entryPoint, ...benchmarkArgs] };
}

function runWorker(runtimeArgs: string[], name: string)
    : Promise<BenchmarkResult>
{
    const command = getWorkerCommand(runtimeArgs, name);

    return new Promise
    (
        (resolve, reject) =>
        {
            const child = spawn(command.executable, command.args, { stdio: ["ignore", "pipe", "inherit"] });
            let output = "";

            child.stdout.setEncoding("utf8");
            child.stdout.on("data", (chunk: string) => output += chunk);
            child.on("error", reject);
            child.on
            (
                "close",
                (code, signal) =>
                {
                    if(code !== 0)
                    {
                        reject(new Error(`Benchmark ${name} failed: ${signal ?? `exit code ${code}`}.`));
                        return;
                    }

                    try
                    {
                        const result = JSON.parse(output) as BenchmarkResult;

                        if(result.benchmarks.length !== 1 || result.benchmarks[0]?.alias !== name)
                            throw new Error("Worker must return exactly the requested benchmark case.");

                        const runs = result.benchmarks[0].runs;

                        if(runs.length !== 1 || !runs[0]?.stats || !Number.isFinite(runs[0].stats.avg) || !Number.isFinite(runs[0].stats.p50))
                            throw new Error("Worker must return one successful measurement.");

                        resolve(result);
                    }
                    catch(error)
                    {
                        reject(new Error(`Invalid benchmark output for ${name}.`, { cause: error }));
                    }
                }
            );
        }
    );
}

export async function runIsolatedBenchmarks(names: string[], runtimeArgs: string[])
{
    const repetitions = getRepetitions(runtimeArgs);
    const option = (key: string) => runtimeArgs.find(argument => argument.startsWith(key + "="))?.slice(key.length + 1);
    const progressOffset = Number(option("--progress-offset") ?? 0);
    const progressTotal = Number(option("--progress-total") ?? names.length * repetitions);
    const startedAt = Number(option("--progress-started-at") ?? Date.now());
    const runtimeLabel = option("--progress-runtime");
    let firstResult: BenchmarkResult | undefined;
    const measurements = new Map<string, { benchmark: BenchmarkTrial; runs: ProcessRun[] }>();
    let completed = 0;
    const rawResultsDirectory = fileURLToPath(new URL(`../dist/isolated-runs/${Date.now()}-${process.pid}/`, import.meta.url));

    if(names.length === 0)
        throw new Error("No benchmark cases match the requested mode and filter.");

    mkdirSync(rawResultsDirectory, { recursive: true });
    console.error(`Raw worker results: ${rawResultsDirectory}`);

    // Run sequentially: concurrent workers would compete for CPU and memory during measurement.
    for(let repetition = 0; repetition < repetitions; ++repetition)
    {
        // Reverse alternate rounds so the same configuration does not always run first.
        const orderedNames = repetition % 2 === 0 ? names : names.slice().reverse();

        for(const name of orderedNames)
        {
            const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
            const elapsed = `${Math.floor(elapsedSeconds / 3600).toString().padStart(2, "0")}:${Math.floor(elapsedSeconds / 60 % 60).toString().padStart(2, "0")}:${(elapsedSeconds % 60).toString().padStart(2, "0")}`;
            const totalCompleted = progressOffset + completed;
            console.error(`[total ${totalCompleted}/${progressTotal} ${(100 * totalCompleted / progressTotal).toFixed(1)}% | elapsed ${elapsed}] ${runtimeLabel ? runtimeLabel + " " : ""}[${++completed}/${names.length * repetitions}] ${name} (repetition ${repetition + 1}/${repetitions})`);
            const result = await runWorker(runtimeArgs, name);
            const file = path.join(rawResultsDirectory, `${name.replace(/[^A-Za-z0-9_-]/g, "_")}-${repetition + 1}.json`);
            writeFileSync(file, JSON.stringify(result));
            firstResult ??= result;
            const benchmark = result.benchmarks[0]!;
            let measurement = measurements.get(name);

            if(!measurement)
            {
                measurement = { benchmark, runs: [] };
                measurements.set(name, measurement);
            }

            measurement.runs.push({ ...benchmark.runs[0]!, context: result.context, file });
        }
    }

    if(!firstResult)
        throw new Error("No benchmark cases match the requested mode and filter.");

    return {
        ...firstResult,
        rawResultsDirectory,
        benchmarks: names.map
        (
            name =>
            {
                const measurement = measurements.get(name)!;

                return { ...measurement.benchmark, runs: measurement.runs, summary: summarize(measurement.runs) };
            }
        )
    };
}
