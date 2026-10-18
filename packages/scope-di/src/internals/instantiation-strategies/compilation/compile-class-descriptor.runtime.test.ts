import { getTestRegistrationMaps } from "./compilation.test-helpers";
import { ClassDependencyDescriptor } from "../../../types/class-dependency-descriptor";
import { describe, expect, it, jest } from "@jest/globals";
import { DependencyDescriptorType, DependencyLifetime } from "../../../types";
import { createSyncValueStrategyScope } from "../strategies/sync/sync-strategy.test-helpers";
import { compileClassDescriptor } from "./compile-class-descriptor";

class ArgumentList
{
    public constructor(public readonly values: unknown[])
    {
    }
}

class Target extends ArgumentList
{
    public constructor(...values: unknown[])
    {
        super(values);
    }
}

describe
(
    "compileClassDescriptor",
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
                    const descriptor: ClassDependencyDescriptor<unknown> =
                    {
                        key: "target",
                        type: DependencyDescriptorType.Class,
                        lifetime: DependencyLifetime.Transient,
                        constructor: Target,
                        subDependenciesKeys: keys
                    };

                    const [collectionRegistrations, singularRegistrations] = getTestRegistrationMaps(scope, descriptor.subDependenciesKeys);
                    compileClassDescriptor(collectionRegistrations, singularRegistrations, descriptor, allowRuntimeCodeGeneration);
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
