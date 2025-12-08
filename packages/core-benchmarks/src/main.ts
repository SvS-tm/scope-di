// deno-lint-ignore-file no-sloppy-imports
import * as scopeDiRegistration from "./scope-di/registration.ts";
import * as inversifyRegistration from "./inversify/registration.ts";
import * as tsyringeRegistration from "./tsyringe/registration.ts";
import { bench, boxplot, summary, run, group } from "mitata";

const benchmarks = 
[
    {
        name: "registrationClass",
        runs: 
        [
            {
                name: "scope-di:registrationClass",
                action: scopeDiRegistration.registrationClass,
                baseline: true
            },
            {
                name: "inversify:registrationClass",
                action: inversifyRegistration.registrationClass,
                baseline: false
            },
            {
                name: "tsyringe:registrationClass",
                action: tsyringeRegistration.registrationClass,
                baseline: false
            }
        ]
    },
    {
        name: "registrationValue",
        runs:
        [
            {
                name: "scope-di:registrationValue",
                action: scopeDiRegistration.registrationValue,
                baseline: true
            },
            {
                name: "inversify:registrationValue",
                action: inversifyRegistration.registrationValue,
                baseline: false
            },
            {
                name: "tsyringe:registrationValue",
                action: tsyringeRegistration.registrationValue,
                baseline: false
            }
        ]
    },
    {
        name: "registrationFactory",
        runs:
        [
            {
                name: "scope-di:registrationFactory",
                action: scopeDiRegistration.registrationFactory,
                baseline: true
            },
            {
                name: "inversify:registrationFactory",
                action: inversifyRegistration.registrationFactory,
                baseline: false
            },
            {
                name: "tsyringe:registrationFactory",
                action: tsyringeRegistration.registrationFactory,
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

await run({ colors: true, format: "mitata" });
