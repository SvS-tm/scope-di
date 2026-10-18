import { getTestRegistrationMaps } from "./compilation.test-helpers";
import { FactoryDependencyDescriptor } from "../../../types/factory-dependency-descriptor";
import { describe, expect, it, jest } from "@jest/globals";
import { DependencyDescriptorType, DependencyLifetime } from "../../../types";
import { createSyncValueStrategyScope } from "../strategies/sync/sync-strategy.test-helpers";
import { compileFactoryDescriptor } from "./compile-factory-descriptor";

function collectArguments(...values: unknown[])
{
    return { values };
}

describe
(
    "compileFactoryDescriptor",
    () =>
    {
        it.each([false, true])
        (
            "compiles a spread fallback when generation is blocked and enabled is %s",
            async allowRuntimeCodeGeneration =>
            {
                const values = [0, 1, 2, 3, 4, 5];
                const scope = createSyncValueStrategyScope(new Map(values.map((value, index) => [`dependency${index}`, value])));
                const keys = values.map((_value, index) => `dependency${index}`);
                const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
                const generation = jest.spyOn(globalThis, "Function").mockImplementation
                (
                    () =>
                    {
                        throw new EvalError("Runtime code generation is blocked");
                    }
                );

                try
                {
                    const descriptor: FactoryDependencyDescriptor<unknown> =
                    {
                        key: "target",
                        type: DependencyDescriptorType.Factory,
                        lifetime: DependencyLifetime.Transient,
                        factory: collectArguments,
                        subDependenciesKeys: keys
                    };

                    const [collectionRegistrations, singularRegistrations] = getTestRegistrationMaps(scope, descriptor.subDependenciesKeys);
                    compileFactoryDescriptor(collectionRegistrations, singularRegistrations, descriptor, allowRuntimeCodeGeneration);
                    const compiled = descriptor;

                    expect(await compiled.instatiationStrategy(scope)).toEqual(expect.objectContaining({ values }));
                    expect(await compiled.instatiationStrategy(scope)).toEqual(expect.objectContaining({ values }));
                    expect(generation).toHaveBeenCalledTimes(allowRuntimeCodeGeneration ? 1 : 0);
                    expect(warn).toHaveBeenCalledTimes(allowRuntimeCodeGeneration ? 1 : 0);
                    if (allowRuntimeCodeGeneration)
                        expect(warn).toHaveBeenCalledWith
                        (
                            "[scope-di] Code generation failed; continuing with a fallback strategy.",
                            descriptor.key,
                            expect.any(EvalError)
                        );
                }
                finally
                {
                    generation.mockRestore();
                    warn.mockRestore();
                }
            }
        );

    }
);
