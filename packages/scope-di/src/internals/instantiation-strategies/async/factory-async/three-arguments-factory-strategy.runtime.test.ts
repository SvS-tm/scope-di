import { DependencyDescriptorType, DependencyLifetime } from "../../../../types";
import { createAsyncStrategyChildScope } from "../async-strategy.test-helpers";
import { getTestRegistrationMaps } from "../../compilation.test-helpers";
import { describe, expect, it, jest } from "@jest/globals";
import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { collectAsyncArguments, assertTrackedPromise, createAsyncStrategyScope } from "../async-strategy.test-helpers";
import { createThreeArgumentsAsyncFactoryStrategy } from "./three-arguments-factory-strategy";

describe
(
    "createThreeArgumentsAsyncFactoryStrategy",
    () =>
    {
        it
        (
            "preserves argument order and constructs anew through the supplied scope",
            async () =>
            {
                const values = Array.from({ length: 3 }, (_, index) => index);
                const firstScope = createAsyncStrategyScope(values);
                const secondScope = { scope: createAsyncStrategyChildScope(firstScope.scope) };
                const keys = firstScope.keys.slice().reverse();
                const instantiate = createThreeArgumentsAsyncFactoryStrategy
                (
                    ...getTestRegistrationMaps(firstScope.scope, keys),
                    {
                        key: "target",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Singleton,
                        factory: collectAsyncArguments,
                        subDependenciesKeys: keys
                    }
                );
                const first = instantiate(firstScope.scope);
                assertTrackedPromise(first);
                const second = instantiate(secondScope.scope);

                expect(TrackedPromise.isTracked(first)).toBe(true);

                expect((await first).values).toEqual(values.slice().reverse());
                expect((await second).values).toEqual(values.slice().reverse());
                expect(await first).not.toBe(await instantiate(firstScope.scope));
            }
        );

        it
        (
            "waits for pending dependencies before construction and takes the settled path on reuse",
            async () =>
            {
                const values = Array.from({ length: 3 }, (_, index) => index);
                const dependency = TrackedPromise.controlled<number>();
                const { scope, keys } = createAsyncStrategyScope(values, new Map([[0, dependency]]));
                const instantiate = createThreeArgumentsAsyncFactoryStrategy
                (
                    ...getTestRegistrationMaps(scope, keys),
                    {
                        key: "target",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Singleton,
                        factory: collectAsyncArguments,
                        subDependenciesKeys: keys
                    }
                );
                const first = instantiate(scope);
                assertTrackedPromise(first);

                expect(first[TrackedPromise.status]).toBe(TrackedPromiseStatus.Pending);
                dependency[TrackedPromise.resolve](42);

                expect((await first).values).toEqual([42, ...values.slice(1)]);

                const next = instantiate(scope);
                assertTrackedPromise(next);

                expect((await next).values).toEqual([42, ...values.slice(1)]);
            }
        );

        it
        (
            "propagates dependency rejection without calling the factory",
            async () =>
            {
                const dependency = TrackedPromise.controlled<number>();
                const { scope, keys } = createAsyncStrategyScope(new Array(3).fill(0), new Map([[0, dependency]]));
                const construct = jest.fn(collectAsyncArguments);
                const instantiate = createThreeArgumentsAsyncFactoryStrategy
                (
                    ...getTestRegistrationMaps(scope, keys),
                    {
                        key: "target",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Singleton,
                        factory: construct,
                        subDependenciesKeys: keys
                    }
                );
                const promise = instantiate(scope);
                assertTrackedPromise(promise);
                const error = new Error("Dependency failed");
                const rejection = expect(promise).rejects.toBe(error);

                dependency[TrackedPromise.reject](error);

                await rejection;
                expect(construct).not.toHaveBeenCalled();
            }
        );

        it
        (
            "passes promise-valued sync dependencies through unchanged",
            async () =>
            {
                const promiseValue = Promise.resolve(42);
                const { scope, keys } = createAsyncStrategyScope(new Array(3).fill(promiseValue));
                const instantiate = createThreeArgumentsAsyncFactoryStrategy
                (
                    ...getTestRegistrationMaps(scope, keys),
                    {
                        key: "target",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Singleton,
                        factory: collectAsyncArguments,
                        subDependenciesKeys: keys
                    }
                );
                const result = await instantiate(scope);

                expect(result.values).toHaveLength(3);

                for (const value of result.values)
                    expect(value).toBe(promiseValue);
            }
        );

        it
        (
            "tracks the factory result after dependencies are ready",
            async () =>
            {
                const { scope, keys } = createAsyncStrategyScope(new Array(3).fill(0));
                const result = TrackedPromise.controlled<number>();
                const instantiate = createThreeArgumentsAsyncFactoryStrategy
                (
                    ...getTestRegistrationMaps(scope, keys),
                    {
                        key: "target",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Singleton,
                        factory: () => result,
                        subDependenciesKeys: keys
                    }
                );
                const promise = instantiate(scope);
                assertTrackedPromise(promise);

                expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Pending);
                result[TrackedPromise.resolve](42);

                expect(await promise).toBe(42);
            }
        );

        it
        (
            "propagates factory rejection",
            async () =>
            {
                const error = new Error("Factory failed");
                const { scope, keys } = createAsyncStrategyScope(new Array(3).fill(0));
                const instantiate = createThreeArgumentsAsyncFactoryStrategy
                (
                    ...getTestRegistrationMaps(scope, keys),
                    {
                        key: "target",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Singleton,
                        factory: () => Promise.reject(error),
                        subDependenciesKeys: keys
                    }
                );

                await expect(instantiate(scope)).rejects.toBe(error);
            }
        );
    }
);

