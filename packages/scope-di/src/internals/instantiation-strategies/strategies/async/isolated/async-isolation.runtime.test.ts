import { compileAsyncClassDescriptor } from "../../../compilation/compile-async-class-descriptor";
import * as isolatedTransientStrategies from "../../isolated-transient-strategies";
import { describe, expect, it, jest } from "@jest/globals";
import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { DependencyDescriptorType, DependencyLifetime } from "../../../../../types";
import { createAsyncClassStrategy } from "./class/create-async-class-strategy";
import { createAsyncFactoryStrategy } from "./factory/create-async-factory-strategy";
import { AsyncArgumentList, createAsyncStrategyScope, collectAsyncArguments, assertTrackedPromise } from "../async-strategy.test-helpers";
import { getTestRegistrationMaps } from "../../../compilation/compilation.test-helpers";

describe
(
    "Isolated async strategies",
    () =>
    {
        it.each([0, 1, 5, 6, 10])
        (
            "preserves arguments and tracking for count=%s",
            async count =>
            {
                const values = Array.from({ length: count }, (_, index) => index);
                const { scope, keys } = createAsyncStrategyScope(values);
                const [collections, singles] = getTestRegistrationMaps(scope, keys);
                const tracking = jest.spyOn(scope, "trackTransientAsyncDependency");
                const classStrategy = createAsyncClassStrategy(collections, singles, { key: "class", type: DependencyDescriptorType.ClassAsync, lifetime: DependencyLifetime.Transient, constructor: AsyncArgumentList, subDependenciesKeys: keys });
                const factoryStrategy = createAsyncFactoryStrategy(collections, singles, { key: "factory", type: DependencyDescriptorType.FactoryAsync, lifetime: DependencyLifetime.Transient, factory: collectAsyncArguments, subDependenciesKeys: keys });
                const first = classStrategy(scope);
                assertTrackedPromise(first);
                expect(first[TrackedPromise.status]).toBe(TrackedPromiseStatus.Success);
                expect((await first).values).toEqual(values);
                expect((await factoryStrategy(scope)).values).toEqual(values);
                expect(await classStrategy(scope)).not.toBe(await first);
                expect(tracking).toHaveBeenCalledTimes(3);
            }
        );

        it
        (
            "waits for dependencies and preserves argument order",
            async () =>
            {
                let finish!: (value: unknown) => void;
                const pending = new Promise(resolve => { finish = resolve; });
                const { scope, keys } = createAsyncStrategyScope([1, 2], new Map([[0, pending]]));
                const [collections, singles] = getTestRegistrationMaps(scope, keys);
                const instantiate = jest.fn(collectAsyncArguments);
                const strategy = createAsyncFactoryStrategy(collections, singles, { key: "target", type: DependencyDescriptorType.FactoryAsync, lifetime: DependencyLifetime.Transient, factory: instantiate, subDependenciesKeys: keys });
                const result = strategy(scope);
                expect(instantiate).not.toHaveBeenCalled();
                finish(1);
                expect((await result).values).toEqual([1, 2]);
                expect(instantiate).toHaveBeenCalledTimes(1);
            }
        );

        it
        (
            "propagates rejection and supports a subsequent transient resolution",
            async () =>
            {
                const { scope } = createAsyncStrategyScope([]);
                const error = new Error("Factory failed");
                let calls = 0;
                const strategy = createAsyncFactoryStrategy(new Map(), new Map(), { key: "target", type: DependencyDescriptorType.FactoryAsync, lifetime: DependencyLifetime.Transient, factory: () => ++calls === 1 ? Promise.reject(error) : Promise.resolve({}), subDependenciesKeys: [] });
                await expect(strategy(scope)).rejects.toBe(error);
                await expect(strategy(scope)).resolves.toEqual({});
                expect(calls).toBe(2);
            }
        );

        it
        (
            "falls back to isolated spread when code generation is blocked",
            async () =>
            {
                const { scope, keys } = createAsyncStrategyScope([0, 1, 2, 3, 4, 5]);
                const [collections, singles] = getTestRegistrationMaps(scope, keys);
                const generation = jest.spyOn(globalThis, "Function").mockImplementation(() => { throw new EvalError("Blocked"); });
                try
                {
                    const descriptor = { key: "target", type: DependencyDescriptorType.ClassAsync as const, lifetime: DependencyLifetime.Transient, constructor: AsyncArgumentList, subDependenciesKeys: keys };
                    compileAsyncClassDescriptor(collections, singles, descriptor, true, isolatedTransientStrategies);
                    expect((await descriptor.instatiationStrategy(scope) as AsyncArgumentList).values).toEqual([0, 1, 2, 3, 4, 5]);
                    expect(generation).toHaveBeenCalledTimes(1);
                }
                finally
                {
                    generation.mockRestore();
                }
            }
        );
        it
        (
            "keeps an async factory pending even when its dependencies are settled",
            async () =>
            {
                let finish!: (value: object) => void;
                const pending = new Promise<object>(resolve => { finish = resolve; });
                const { scope, keys } = createAsyncStrategyScope([1]);
                const [collections, singles] = getTestRegistrationMaps(scope, keys);
                const strategy = createAsyncFactoryStrategy
                (
                    collections,
                    singles,
                    {
                        key: "target",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Transient,
                        factory: () => pending,
                        subDependenciesKeys: keys
                    },
                );
                const result = strategy(scope);
                assertTrackedPromise(result);
                expect(result[TrackedPromise.status]).not.toBe(TrackedPromiseStatus.Success);
                const value = {};
                finish(value);
                expect(await result).toBe(value);
            }
        );
    }
);
