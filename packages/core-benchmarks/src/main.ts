// deno-lint-ignore-file no-sloppy-imports
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
import { bench, boxplot, summary, run, group } from "mitata";

type BenchmarkAction = typeof scopeDiRegistration.registrationClass;

type BenchmarkRun =
{
    name: string;
    action: BenchmarkAction;
    baseline: boolean;
};

function createRuns
(
    benchmarkName: string,
    actions:
    {
        scopeDi: BenchmarkAction;
        inversify: BenchmarkAction;
        tsyringe: BenchmarkAction;
        awilix: BenchmarkAction;
        typedi: BenchmarkAction;
        typedInject: BenchmarkAction;
        needleDi?: BenchmarkAction;
    }
)
    : BenchmarkRun[]
{
    const runs: BenchmarkRun[] = [
        {
            name: `scope-di:${benchmarkName}`,
            action: actions.scopeDi,
            baseline: true
        },
        {
            name: `inversify:${benchmarkName}`,
            action: actions.inversify,
            baseline: false
        },
        {
            name: `tsyringe:${benchmarkName}`,
            action: actions.tsyringe,
            baseline: false
        },
        {
            name: `awilix:${benchmarkName}`,
            action: actions.awilix,
            baseline: false
        },
        {
            name: `typedi:${benchmarkName}`,
            action: actions.typedi,
            baseline: false
        },
        {
            name: `typed-inject:${benchmarkName}`,
            action: actions.typedInject,
            baseline: false
        }
    ];

    if(actions.needleDi)
    {
        runs.push
        (
            {
                name: `needle-di:${benchmarkName}`,
                action: actions.needleDi,
                baseline: false
            }
        );
    }

    return runs;
}

function getRuntimeArgs()
{
    const args = (globalThis as { process?: { argv?: string[] }; Deno?: { args?: string[] } });

    return args.process?.argv ?? args.Deno?.args ?? [];
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

    return new RegExp(filterArgument.slice("--filter=".length));
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
        name: "resolveValue",
        runs: createRuns
        (
            "resolveValue",
            {
                scopeDi: scopeDiResolution.resolveValue,
                inversify: inversifyResolution.resolveValue,
                tsyringe: tsyringeResolution.resolveValue,
                awilix: awilixResolution.resolveValue,
                typedi: typediResolution.resolveValue,
                typedInject: typedInjectResolution.resolveValue,
                needleDi: needleDiResolution.resolveValue
            }
        )
    },
    {
        name: "resolveSingletonClass",
        runs: createRuns
        (
            "resolveSingletonClass",
            {
                scopeDi: scopeDiResolution.resolveSingletonClass,
                inversify: inversifyResolution.resolveSingletonClass,
                tsyringe: tsyringeResolution.resolveSingletonClass,
                awilix: awilixResolution.resolveSingletonClass,
                typedi: typediResolution.resolveSingletonClass,
                typedInject: typedInjectResolution.resolveSingletonClass,
                needleDi: needleDiResolution.resolveSingletonClass
            }
        )
    },
    {
        name: "resolveTransientClass",
        runs: createRuns
        (
            "resolveTransientClass",
            {
                scopeDi: scopeDiResolution.resolveTransientClass,
                inversify: inversifyResolution.resolveTransientClass,
                tsyringe: tsyringeResolution.resolveTransientClass,
                awilix: awilixResolution.resolveTransientClass,
                typedi: typediResolution.resolveTransientClass,
                typedInject: typedInjectResolution.resolveTransientClass
            }
        )
    },
    {
        name: "resolveSingletonFactory",
        runs: createRuns
        (
            "resolveSingletonFactory",
            {
                scopeDi: scopeDiResolution.resolveSingletonFactory,
                inversify: inversifyResolution.resolveSingletonFactory,
                tsyringe: tsyringeResolution.resolveSingletonFactory,
                awilix: awilixResolution.resolveSingletonFactory,
                typedi: typediResolution.resolveSingletonFactory,
                typedInject: typedInjectResolution.resolveSingletonFactory,
                needleDi: needleDiResolution.resolveSingletonFactory
            }
        )
    },
    {
        name: "resolveTransientFactory",
        runs: createRuns
        (
            "resolveTransientFactory",
            {
                scopeDi: scopeDiResolution.resolveTransientFactory,
                inversify: inversifyResolution.resolveTransientFactory,
                tsyringe: tsyringeResolution.resolveTransientFactory,
                awilix: awilixResolution.resolveTransientFactory,
                typedi: typediResolution.resolveTransientFactory,
                typedInject: typedInjectResolution.resolveTransientFactory
            }
        )
    },
    {
        name: "resolveTransientFactoryChain",
        runs: createRuns
        (
            "resolveTransientFactoryChain",
            {
                scopeDi: scopeDiResolution.resolveTransientFactoryChain,
                inversify: inversifyResolution.resolveTransientFactoryChain,
                tsyringe: tsyringeResolution.resolveTransientFactoryChain,
                awilix: awilixResolution.resolveTransientFactoryChain,
                typedi: typediResolution.resolveTransientFactoryChain,
                typedInject: typedInjectResolution.resolveTransientFactoryChain
            }
        )
    },
    {
        name: "resolveTransientFactoryWithFiveDependencies",
        runs: createRuns
        (
            "resolveTransientFactoryWithFiveDependencies",
            {
                scopeDi: scopeDiResolution.resolveTransientFactoryWithFiveDependencies,
                inversify: inversifyResolution.resolveTransientFactoryWithFiveDependencies,
                tsyringe: tsyringeResolution.resolveTransientFactoryWithFiveDependencies,
                awilix: awilixResolution.resolveTransientFactoryWithFiveDependencies,
                typedi: typediResolution.resolveTransientFactoryWithFiveDependencies,
                typedInject: typedInjectResolution.resolveTransientFactoryWithFiveDependencies
            }
        )
    },
    {
        name: "resolveTransientFactoryWithSixDependencies",
        runs: createRuns
        (
            "resolveTransientFactoryWithSixDependencies",
            {
                scopeDi: scopeDiResolution.resolveTransientFactoryWithSixDependencies,
                inversify: inversifyResolution.resolveTransientFactoryWithSixDependencies,
                tsyringe: tsyringeResolution.resolveTransientFactoryWithSixDependencies,
                awilix: awilixResolution.resolveTransientFactoryWithSixDependencies,
                typedi: typediResolution.resolveTransientFactoryWithSixDependencies,
                typedInject: typedInjectResolution.resolveTransientFactoryWithSixDependencies
            }
        )
    },
    {
        name: "scope-di diagnostics",
        runs:
        [
            {
                name: "scope-di:registryResolveSingleDescriptor",
                action: scopeDiDiagnostics.registryResolveSingleDescriptor,
                baseline: true
            },
            {
                name: "scope-di:registryResolveCollectionDescriptors",
                action: scopeDiDiagnostics.registryResolveCollectionDescriptors,
                baseline: false
            },
            {
                name: "scope-di:findResolvedSingletonMiss",
                action: scopeDiDiagnostics.findResolvedSingletonMiss,
                baseline: false
            },
            {
                name: "scope-di:findResolvedSingletonHit",
                action: scopeDiDiagnostics.findResolvedSingletonHit,
                baseline: false
            },
            {
                name: "scope-di:findResolvedTransient",
                action: scopeDiDiagnostics.findResolvedTransient,
                baseline: false
            },
            {
                name: "scope-di:resolveNoKeys",
                action: scopeDiDiagnostics.resolveNoKeys,
                baseline: false
            },
            {
                name: "scope-di:resolveCachedValue",
                action: scopeDiDiagnostics.resolveCachedValue,
                baseline: false
            },
            {
                name: "scope-di:resolveCachedThreeValues",
                action: scopeDiDiagnostics.resolveCachedThreeValues,
                baseline: false
            },
            {
                name: "scope-di:resolveCachedFiveValues",
                action: scopeDiDiagnostics.resolveCachedFiveValues,
                baseline: false
            },
            {
                name: "scope-di:resolveCachedSixValues",
                action: scopeDiDiagnostics.resolveCachedSixValues,
                baseline: false
            },
            {
                name: "scope-di:resolveCollectionValues",
                action: scopeDiDiagnostics.resolveCollectionValues,
                baseline: false
            },
            {
                name: "scope-di:resolveTransientFactoryWithFiveDependencies",
                action: scopeDiDiagnostics.resolveTransientFactoryWithFiveDependencies,
                baseline: false
            },
            {
                name: "scope-di:resolveTransientFactoryWithSixDependencies",
                action: scopeDiDiagnostics.resolveTransientFactoryWithSixDependencies,
                baseline: false
            },
            {
                name: "scope-di:createChildScope",
                action: scopeDiDiagnostics.createChildScope,
                baseline: false
            },
            {
                name: "scope-di:disposeEmptyScope",
                action: scopeDiDiagnostics.disposeEmptyScope,
                baseline: false
            },
            {
                name: "scope-di:disposeResolvedSingleton",
                action: scopeDiDiagnostics.disposeResolvedSingleton,
                baseline: false
            }
        ]
    }
];

const iterations = [3000];

for(const { name, runs } of benchmarks)
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
                            for(const { name, action, baseline } of runs)
                            {
                                bench(name, action)
                                    .gc("inner")
                                    .baseline(baseline)
                                    .args({ iterations });
                            }
                        }
                    );
                }
            );
        }
    );
}

const runtimeArgs = getRuntimeArgs();
const outputFormat = getOutputFormat(runtimeArgs);
const filter = getFilter(runtimeArgs);
const runOptions = { colors: outputFormat !== "json", format: outputFormat } as const;

await run
(
    filter
        ? { ...runOptions, filter }
        : runOptions
);
