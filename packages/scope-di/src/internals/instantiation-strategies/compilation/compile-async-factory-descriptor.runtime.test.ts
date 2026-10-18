import { getTestRegistrationMaps } from "./compilation.test-helpers";
import { describe, expect, it, jest } from "@jest/globals";
import { TrackedPromise } from "@svs-tm/system";
import { AsyncFactoryDependencyDescriptor } from "../../../types/async-factory-dependency-descriptor";
import { DependencyDescriptorType } from "../../../types/dependency-descriptor-type";
import { DependencyLifetime } from "../../../types/dependency-lifetime";
import { AsyncArgumentList, collectAsyncArguments, createAsyncStrategyScope } from "../strategies/async/async-strategy.test-helpers";
import { compileAsyncFactoryDescriptor } from "./compile-async-factory-descriptor";

describe
(
    "compileAsyncFactoryDescriptor",
    () =>
    {
        it.each([false, true])
        (
            "compiles a spread fallback when generation is blocked and enabled is %s",
            async allowRuntimeCodeGeneration =>
            {
                const values = [0, 1, 2, 3, 4, 5];
                const { scope, keys } = createAsyncStrategyScope(values);
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
                    const descriptor: AsyncFactoryDependencyDescriptor<unknown> =
                    {
                        key: "target",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Transient,
                        factory: collectAsyncArguments,
                        subDependenciesKeys: keys
                    };

                    const [collectionRegistrations, singularRegistrations] = getTestRegistrationMaps(scope, descriptor.subDependenciesKeys);
                    compileAsyncFactoryDescriptor(collectionRegistrations, singularRegistrations, descriptor, allowRuntimeCodeGeneration);
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

        it.each([undefined, 0, 1, 2, 3, 4, 5, 6, 8])
        (
            "preserves descriptor metadata and resolves %s dependencies",
            async count =>
            {
                const values = Array.from({ length: count ?? 0 }, (_, index) => index);
                const { scope, keys } = createAsyncStrategyScope(values);
                const descriptor: AsyncFactoryDependencyDescriptor<AsyncArgumentList> =
                {
                    key: "target",
                    type: DependencyDescriptorType.FactoryAsync,
                    lifetime: DependencyLifetime.Scoped,
                    factory: collectAsyncArguments,
                    ...(count === undefined ? {} : { subDependenciesKeys: keys })
                };
                const [collectionRegistrations, singularRegistrations] = getTestRegistrationMaps(scope, descriptor.subDependenciesKeys);
                compileAsyncFactoryDescriptor(collectionRegistrations, singularRegistrations, descriptor, false);
                const compiled = descriptor;

                expect(compiled).toBe(descriptor);
                expect(compiled).toMatchObject(descriptor);
                expect(await compiled.instatiationStrategy(scope)).toEqual(new AsyncArgumentList(...values));
            }
        );

        it
        (
            "resolves pending dependencies using generated construction",
            async () =>
            {
                const pending = TrackedPromise.controlled<number>();
                const values = [0, 1, 2, 3, 4, 5, 6, 7];
                const { scope, keys } = createAsyncStrategyScope(values, new Map([[0, pending]]));
                const descriptor: AsyncFactoryDependencyDescriptor<AsyncArgumentList> =
                {
                    key: "target",
                    type: DependencyDescriptorType.FactoryAsync,
                    lifetime: DependencyLifetime.Transient,
                    factory: collectAsyncArguments,
                    subDependenciesKeys: keys
                };
                const [collectionRegistrations, singularRegistrations] = getTestRegistrationMaps(scope, descriptor.subDependenciesKeys);
                compileAsyncFactoryDescriptor(collectionRegistrations, singularRegistrations, descriptor, true);
                const compiled = descriptor;
                const promise = compiled.instatiationStrategy(scope);

                pending[TrackedPromise.resolve](42);

                expect(await promise).toEqual(new AsyncArgumentList(42, ...values.slice(1)));
            }
        );

        it
        (
            "can compile larger argument lists without runtime code generation",
            async () =>
            {
                const { scope, keys } = createAsyncStrategyScope([0, 1, 2, 3, 4, 5]);
                const descriptor: AsyncFactoryDependencyDescriptor<AsyncArgumentList> =
                {
                    key: "target",
                    type: DependencyDescriptorType.FactoryAsync,
                    lifetime: DependencyLifetime.Transient,
                    factory: collectAsyncArguments,
                    subDependenciesKeys: keys
                };
                const generation = jest.spyOn(globalThis, "Function").mockImplementation
                (
                    () =>
                    {
                        throw new Error("Runtime code generation is blocked");
                    }
                );

                try
                {
                    const [collectionRegistrations, singularRegistrations] = getTestRegistrationMaps(scope, descriptor.subDependenciesKeys);
                    compileAsyncFactoryDescriptor(collectionRegistrations, singularRegistrations, descriptor, false);
                    const compiled = descriptor;

                    expect(await compiled.instatiationStrategy(scope)).toEqual(new AsyncArgumentList(0, 1, 2, 3, 4, 5));
                    expect(generation).not.toHaveBeenCalled();
                }
                finally
                {
                    generation.mockRestore();
                }
            }
        );
    }
);

