import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

type BenchmarkStats =
{
    avg: number;
    heap?: { avg: number };
};

type BenchmarkRun =
{
    args?: { iterations?: number };
    stats: BenchmarkStats;
};

type Benchmark =
{
    alias?: string;
    args?: { iterations?: number[] };
    runs: BenchmarkRun[];
};

type BenchmarkResult =
{
    metadata?:
    {
        benchmark?:
        {
            mode?: string;
            iterations?: number;
        };
        runtime?:
        {
            name?: string;
            node?: string;
            bun?: string;
            deno?: { deno?: string };
        };
        machine?:
        {
            platform?: string;
            release?: string;
            arch?: string;
            hostname?: string;
            cpu?: { model?: string };
        };
    };
    context?:
    {
        runtime?: string;
        version?: string;
        arch?: string;
        cpu?: { name?: string };
    };
    benchmarks: Benchmark[];
};

type BenchmarkEntry =
{
    library: string;
    avg: number;
    heap: number;
};

type ResultView =
{
    runtime: string;
    file: string;
    link: string;
    result: BenchmarkResult;
};

type ScriptArguments =
{
    files: string[];
    linkBase: string;
    outDir: string;
    runComplete: boolean;
};

type PackageJson =
{
    scripts?: Record<string, string>;
};

type CompleteBenchmark =
{
    script: string;
    outputFile: string;
};

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageDirectory = path.resolve(scriptDirectory, "..");

const completeBenchmarks =
[
    {
        script: "bench:tsx:json:complete",
        outputFile: "bench_node_json_complete.json"
    },
    {
        script: "bench:bun:json:complete",
        outputFile: "bench_bun_json_complete.json"
    },
    {
        script: "bench:deno:json:complete",
        outputFile: "bench_deno_json_complete.json"
    }
] satisfies CompleteBenchmark[];

const speedScenarios =
[
    "warmResolveValue",
    "warmResolveSingletonClass",
    "warmResolveTransientClass",
    "warmResolveSingletonFactory",
    "warmResolveTransientFactory",
    "warmResolveTransientFactoryWithFiveDependencies",
    "warmResolveTransientFactoryWithSixDependencies",
    "warmResolveTransientFactoryDeepWideGraph",
    "warmResolveCachedFactoryWideGraph",
    "registrationClass",
    "registrationValue",
    "registrationFactory"
];

const memoryScenarios =
[
    "warmResolveValue",
    "warmResolveSingletonClass",
    "warmResolveTransientClass",
    "warmResolveTransientFactory",
    "warmResolveTransientFactoryWithFiveDependencies",
    "warmResolveTransientFactoryDeepWideGraph",
    "warmResolveCachedFactoryWideGraph"
];

function parseArguments(argv: string[])
{
    const files: string[] = [];
    let linkBase = process.cwd();
    let outDir: string | undefined;
    let runComplete = false;

    for(let index = 0; index < argv.length; ++index)
    {
        const argument = argv[index]!;

        if(argument === "--help" || argument === "-h")
        {
            printUsage();
            process.exit(0);
        }

        if(argument === "--run-complete")
        {
            runComplete = true;
            continue;
        }

        if(argument === "--link-base")
        {
            const value = argv[++index];

            if(!value)
                throw new Error("Missing value for --link-base.");

            linkBase = path.resolve(process.cwd(), value);
            continue;
        }

        if(argument.startsWith("--link-base="))
        {
            linkBase = path.resolve(process.cwd(), argument.slice("--link-base=".length));
            continue;
        }

        if(argument === "--out-dir")
        {
            const value = argv[++index];

            if(!value)
                throw new Error("Missing value for --out-dir.");

            outDir = path.resolve(process.cwd(), value);
            continue;
        }

        if(argument.startsWith("--out-dir="))
        {
            outDir = path.resolve(process.cwd(), argument.slice("--out-dir=".length));
            continue;
        }

        if(argument === "--file")
        {
            const value = argv[++index];

            if(!value)
                throw new Error("Missing value for --file.");

            files.push(value);
            continue;
        }

        if(argument.startsWith("--file="))
        {
            files.push(argument.slice("--file=".length));
            continue;
        }

        if(argument.startsWith("--"))
            throw new Error(`Unknown argument: ${argument}`);

        files.push(argument);
    }

    if(files.length === 0 && !runComplete)
    {
        printUsage();
        throw new Error("At least one benchmark result file is required unless --run-complete is used.");
    }

    if(!outDir)
    {
        printUsage();
        throw new Error("--out-dir is required.");
    }

    return {
        files,
        linkBase,
        outDir,
        runComplete
    };
}

function printUsage()
{
    console.log("Usage:");
    console.log("  pnpm --filter @svs-tm/core-benchmarks run report:readme -- --out-dir <reports-directory> --link-base <readme-directory> --file <result.json> [--file <result.json> ...]");
    console.log("  pnpm --filter @svs-tm/core-benchmarks run report:readme -- --run-complete --out-dir <reports-directory> --link-base <readme-directory>");
    console.log();
    console.log("Files can also be passed positionally:");
    console.log("  pnpm --filter @svs-tm/core-benchmarks run report:readme -- --out-dir reports/laptop --link-base . results/laptop/node.json results/laptop/bun.json");
}

function resolveResultFile(file: string)
{
    return path.isAbsolute(file)
        ? file
        : path.resolve(process.cwd(), file);
}

function getResultFileLink(filePath: string, linkBase: string)
{
    const relativePath = path.relative(linkBase, filePath).replace(/\\/g, "/");

    return relativePath.startsWith(".")
        ? relativePath
        : `./${relativePath}`;
}

function readResult(filePath: string)
{
    return JSON.parse(readFileSync(filePath, "utf8")) as BenchmarkResult;
}

function readPackageJson()
{
    return JSON.parse(readFileSync(path.join(packageDirectory, "package.json"), "utf8")) as PackageJson;
}

function runCompleteBenchmarks(outDir: string)
{
    const packageJson = readPackageJson();
    const outputFiles: string[] = [];

    mkdirSync(outDir, { recursive: true });

    for(const benchmark of completeBenchmarks)
    {
        const command = packageJson.scripts?.[benchmark.script];

        if(!command)
            throw new Error(`Missing package script: ${benchmark.script}`);

        const outputFile = path.join(outDir, benchmark.outputFile);

        console.error(`Running ${benchmark.script}...`);

        const result = spawnSync
        (
            command,
            {
                cwd: packageDirectory,
                shell: true,
                encoding: "utf8",
                maxBuffer: 1024 * 1024 * 1024
            }
        );

        if(result.stderr)
            console.error(result.stderr);

        if(result.error)
            throw result.error;

        if(result.status !== 0)
            throw new Error(`${benchmark.script} failed with exit code ${result.status ?? "unknown"}.`);

        writeFileSync(outputFile, result.stdout);
        outputFiles.push(outputFile);
    }

    return outputFiles;
}

function getRuntimeLabel(result: BenchmarkResult, filePath: string)
{
    const runtime = result.metadata?.runtime?.name
        ?? result.context?.runtime
        ?? path.basename(filePath).match(/bench_([^_]+)/)?.[1]
        ?? "unknown";

    switch(sanitizeText(runtime).toLowerCase())
    {
        case "node":
        {
            return "Node.js";
        }
        case "bun":
        {
            return "Bun";
        }
        case "deno":
        {
            return "Deno";
        }
        default:
        {
            return sanitizeText(runtime);
        }
    }
}

function getRuntimeVersion(result: BenchmarkResult)
{
    const metadataRuntime = result.metadata?.runtime;

    if(metadataRuntime?.node)
        return sanitizeText(metadataRuntime.node);

    if(metadataRuntime?.bun)
        return sanitizeText(metadataRuntime.bun);

    if(metadataRuntime?.deno?.deno)
        return sanitizeText(metadataRuntime.deno.deno);

    if(result.context?.version)
        return sanitizeText(result.context.version);

    return "not recorded";
}

function getMode(result: BenchmarkResult)
{
    return result.metadata?.benchmark?.mode ?? "not recorded";
}

function getIterations(result: BenchmarkResult)
{
    return result.metadata?.benchmark?.iterations
        ?? result.benchmarks[0]?.runs[0]?.args?.iterations
        ?? result.benchmarks[0]?.args?.iterations?.[0]
        ?? "not recorded";
}

function getMachine(result: BenchmarkResult)
{
    const machine = result.metadata?.machine;

    if(machine)
    {
        const host = machine.hostname ? `${sanitizeText(machine.hostname)} / ` : "";
        const cpu = sanitizeText(machine.cpu?.model ?? "unknown CPU");
        const platform = sanitizeText(machine.platform ?? "unknown platform");
        const release = sanitizeText(machine.release ?? "");
        const arch = sanitizeText(machine.arch ?? "");
        const system = [platform, release, arch].filter(Boolean).join(" ");

        return `${host}${cpu} / ${system}`;
    }

    if(result.context?.cpu?.name && result.context?.arch)
        return `${sanitizeText(result.context.cpu.name)} / ${sanitizeText(result.context.arch)}`;

    return "not recorded";
}

function sanitizeText(value: unknown)
{
    return String(value).replace(/[\x00-\x1F\x7F]/g, "").trim();
}

function getEntries(result: BenchmarkResult, scenario: string)
{
    return result.benchmarks
        .filter((benchmark) => benchmark.alias?.endsWith(`:${scenario}`))
        .map
        (
            (benchmark): BenchmarkEntry =>
            {
                const [library] = benchmark.alias?.split(":") ?? ["unknown"];
                const stats = benchmark.runs[0]?.stats;

                return {
                    library,
                    avg: stats?.avg ?? Number.POSITIVE_INFINITY,
                    heap: stats?.heap?.avg ?? Number.POSITIVE_INFINITY
                };
            }
        );
}

function getPlace(entries: BenchmarkEntry[], library: string)
{
    return entries.findIndex((entry) => entry.library === library) + 1;
}

function formatDuration(nanoseconds: number)
{
    if(nanoseconds < 1_000)
        return `${nanoseconds.toFixed(1)} ns`;

    if(nanoseconds < 1_000_000)
        return `${(nanoseconds / 1_000).toFixed(2)} us`;

    return `${(nanoseconds / 1_000_000).toFixed(2)} ms`;
}

function formatBytes(bytes: number)
{
    if(bytes < 1_000)
        return `${bytes.toFixed(0)} B`;

    if(bytes < 1_000_000)
        return `${(bytes / 1_000).toFixed(2)} KB`;

    return `${(bytes / 1_000_000).toFixed(2)} MB`;
}

function isRenderedRow(row: string | undefined): row is string
{
    return row !== undefined;
}

function renderSpeedRows(resultView: ResultView)
{
    return speedScenarios
        .map
        (
            (scenario) =>
            {
                const entries = getEntries(resultView.result, scenario).sort((a, b) => a.avg - b.avg);
                const scopeDi = entries.find((entry) => entry.library === "scope-di");

                if(entries.length === 0 || !scopeDi)
                    return undefined;

                const winner = entries[0]!;
                const slowest = entries[entries.length - 1]!;

                return `| ${resultView.runtime} | ${getMode(resultView.result)} | \`${scenario}\` | ${getPlace(entries, "scope-di")} / ${entries.length} | ${formatDuration(scopeDi.avg)} | ${winner.library} | ${formatDuration(winner.avg)} | ${slowest.library} | ${formatDuration(slowest.avg)} |`;
            }
        )
        .filter(isRenderedRow)
        .join("\n");
}

function renderMemoryRows(resultView: ResultView)
{
    return memoryScenarios
        .map
        (
            (scenario) =>
            {
                const entries = getEntries(resultView.result, scenario).sort((a, b) => a.heap - b.heap);
                const scopeDi = entries.find((entry) => entry.library === "scope-di");

                if(entries.length === 0 || !scopeDi)
                    return undefined;

                const winner = entries[0]!;
                const highest = entries[entries.length - 1]!;

                return `| ${resultView.runtime} | ${getMode(resultView.result)} | \`${scenario}\` | ${getPlace(entries, "scope-di")} / ${entries.length} | ${formatBytes(scopeDi.heap)} | ${winner.library} | ${formatBytes(winner.heap)} | ${highest.library} | ${formatBytes(highest.heap)} |`;
            }
        )
        .filter(isRenderedRow)
        .join("\n");
}

function renderMatrixRows(resultView: ResultView)
{
    return `| ${resultView.runtime} | ${getRuntimeVersion(resultView.result)} | ${getMachine(resultView.result)} | ${getMode(resultView.result)} | ${getIterations(resultView.result)} | [\`${resultView.file}\`](${resultView.link}) |`;
}

function renderReport(resultView: ResultView)
{
    return [
        `# ${resultView.runtime} Benchmark Report`,
        "",
        "## Speed Summary",
        "",
        "| Runtime | Mode | Scenario | scope-di place | scope-di | Winner | Winner result | Slowest | Slowest result |",
        "| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |",
        renderSpeedRows(resultView),
        "",
        "## Memory Summary",
        "",
        "| Runtime | Mode | Scenario | scope-di place | scope-di allocations | Winner | Winner allocations | Highest allocation library | Highest allocation result |",
        "| --- | --- | --- | ---: | ---: | --- | ---: | --- | ---: |",
        renderMemoryRows(resultView),
        "",
        "## Runtime Matrix",
        "",
        "| Runtime | Version | Machine | Mode | Iterations | Result file |",
        "| --- | --- | --- | --- | ---: | --- |",
        renderMatrixRows(resultView),
        ""
    ].join("\n");
}

function getReportFilePath(resultView: ResultView, outDir: string)
{
    const extension = path.extname(resultView.file);
    const basename = path.basename(resultView.file, extension);

    return path.join(outDir, `${basename}.md`);
}

const scriptArguments = parseArguments(process.argv.slice(2));
const generatedFiles = scriptArguments.runComplete
    ? runCompleteBenchmarks(scriptArguments.outDir)
    : [];

const inputFiles =
[
    ...generatedFiles,
    ...scriptArguments.files
];

const results = inputFiles.map
(
    (file): ResultView =>
    {
        const filePath = resolveResultFile(file);
        const result = readResult(filePath);

        return {
            runtime: getRuntimeLabel(result, filePath),
            file: path.basename(filePath),
            link: getResultFileLink(filePath, scriptArguments.linkBase),
            result
        };
    }
);

mkdirSync(scriptArguments.outDir, { recursive: true });

for(const result of results)
{
    const reportFilePath = getReportFilePath(result, scriptArguments.outDir);

    writeFileSync(reportFilePath, renderReport(result));
    console.log(reportFilePath);
}
