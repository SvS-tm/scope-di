import { describe, expect, it, jest } from "@jest/globals";
import { TrackedPromise } from "@svs-tm/system";
import { AsyncClassDependencyDescriptor } from "../../../../types/async-class-dependency-descriptor";
import { DependencyDescriptorType } from "../../../../types/dependency-descriptor-type";
import { DependencyLifetime } from "../../../../types/dependency-lifetime";
import { AsyncArgumentList, createAsyncStrategyScope } from "../async-strategy.test-helpers";
import { compileAsyncClassDescriptor } from "./compile-async-class-descriptor";

describe
(
    "compileAsyncClassDescriptor",
    () =>
    {
        it.each([false, true])
        (
            "compiles a spread fallback when generation is blocked and enabled is %s",
            async allowRuntimeCodeGeneration =>
            {
                const values = [0, 1, 2, 3, 4, 5];
                const { scope, keys } = createAsyncStrategyScope(values);
                const generation = jest.spyOn(globalThis, "Function").mockImplementation
                (
                    () =>
                    {
                        throw new EvalError("Runtime code generation is blocked");
                    }
                );

                try
                {
                    const compiled = compileAsyncClassDescriptor
                    (
                        {
                            key: "target",
                            type: DependencyDescriptorType.ClassAsync,
                            lifetime: DependencyLifetime.Transient,
                            constructor: AsyncArgumentList,
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

        it.each([undefined, 0, 1, 2, 3, 4, 5, 6, 8])
        (
            "preserves descriptor metadata and resolves %s dependencies",
            async count =>
            {
                const values = Array.from({ length: count ?? 0 }, (_, index) => index);
                const { scope, keys } = createAsyncStrategyScope(values);
                const descriptor: AsyncClassDependencyDescriptor<AsyncArgumentList> =
                {
                    key: "target",
                    type: DependencyDescriptorType.ClassAsync,
                    lifetime: DependencyLifetime.Scoped,
                    constructor: AsyncArgumentList,
                    ...(count === undefined ? {} : { subDependenciesKeys: keys })
                };
                const compiled = compileAsyncClassDescriptor(descriptor, false);

                expect(compiled).not.toBe(descriptor);
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
                const descriptor: AsyncClassDependencyDescriptor<AsyncArgumentList> =
                {
                    key: "target",
                    type: DependencyDescriptorType.ClassAsync,
                    lifetime: DependencyLifetime.Transient,
                    constructor: AsyncArgumentList,
                    subDependenciesKeys: keys
                };
                const compiled = compileAsyncClassDescriptor(descriptor, true);
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
                const descriptor: AsyncClassDependencyDescriptor<AsyncArgumentList> =
                {
                    key: "target",
                    type: DependencyDescriptorType.ClassAsync,
                    lifetime: DependencyLifetime.Transient,
                    constructor: AsyncArgumentList,
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
                    const compiled = compileAsyncClassDescriptor(descriptor, false);

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

