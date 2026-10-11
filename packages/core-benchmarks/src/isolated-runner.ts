import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { run } from "mitata";

type BenchmarkResult = Awaited<ReturnType<typeof run>>;

function getWorkerCommand(runtimeArgs: string[], name: string)
{
    const entryPoint = fileURLToPath(new URL("./main.ts", import.meta.url));
    const benchmarkArgs = runtimeArgs.filter
    (
        argument => argument.startsWith("--mode=") || argument.startsWith("--iterations=")
    );
    benchmarkArgs.push("--json", `--case=${name}`);

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

                        if(runs.length !== 1 || !runs[0]?.stats || !Number.isFinite(runs[0].stats.avg))
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
    let combined: BenchmarkResult | undefined;

    // Run sequentially: concurrent workers would compete for CPU and memory during measurement.
    for(let index = 0; index < names.length; ++index)
    {
        const name = names[index]!;
        console.error(`[${index + 1}/${names.length}] ${name}`);
        const result = await runWorker(runtimeArgs, name);

        if(!combined)
            combined = { ...result, benchmarks: [] };

        combined.benchmarks.push(...result.benchmarks.map(benchmark => ({ ...benchmark, context: result.context })));
    }

    if(!combined)
        throw new Error("No benchmark cases match the requested mode and filter.");

    return combined;
}
