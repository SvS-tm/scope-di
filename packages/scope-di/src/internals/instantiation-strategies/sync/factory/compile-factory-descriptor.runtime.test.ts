import { describe, expect, it, jest } from "@jest/globals";
import { DependencyDescriptorType, DependencyLifetime } from "../../../../types";
import { createSyncValueStrategyScope } from "../sync-strategy.test-helpers";
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
                const generation = jest.spyOn(globalThis, "Function").mockImplementation
                (
                    () =>
                    {
                        throw new EvalError("Runtime code generation is blocked");
                    }
                );

                try
                {
                    const compiled = compileFactoryDescriptor
                    (
                        {
                            key: "target",
                            type: DependencyDescriptorType.Factory,
                            lifetime: DependencyLifetime.Transient,
                            factory: collectArguments,
                            subDependenciesKeys: keys
                        },
                        allowRuntimeCodeGeneration
                    );

                    expect(await compiled.instatiationStrategy(scope)).toEqual(expect.objectContaining({ values }));
                    expect(await compiled.instatiationStrategy(scope)).toEqual(expect.objectContaining({ values }));
                    expect(generation).toHaveBeenCalledTimes(allowRuntimeCodeGeneration ? 1 : 0);
                }
                finally
                {
                    generation.mockRestore();
                }
            }
        );

    }
);
