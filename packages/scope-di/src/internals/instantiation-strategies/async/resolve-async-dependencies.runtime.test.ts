import { describe, expect, it, jest } from "@jest/globals";
import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { DependencyDescriptorType, DependencyLifetime, RegisteredDependencies } from "../../../types";
import { DependencyDescriptorsBucket } from "../../../types/internals/dependency-descriptors-bucket";
import { createDefaultDiScope } from "../../scope/default-di-scope.test-helpers";
import { createAsyncStrategyScope } from "./async-strategy.test-helpers";
import { resolveAsyncDependencies } from "./resolve-async-dependencies";

describe
(
    "resolveAsyncDependencies",
    () =>
    {
        it
        (
            "returns a successful tracked promise for an empty dependency list",
            async () =>
            {
                const { scope } = createAsyncStrategyScope([]);
                const promise = resolveAsyncDependencies(scope, []);

                expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Success);
                expect(await promise).toEqual([]);
            }
        );

        it
        (
            "starts all pending dependencies before waiting and preserves their registration order",
            async () =>
            {
                const first = TrackedPromise.controlled<number>();
                const second = TrackedPromise.controlled<number>();
                const firstFactory = jest.fn(() => first);
                const secondFactory = jest.fn(() => second);
                const descriptors = new Map<string, DependencyDescriptorsBucket>()
                    .set("first", {
                        key: "first",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Singleton,
                        factory: firstFactory
                    })
                    .set("second", {
                        key: "second",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Singleton,
                        factory: secondFactory
                    });
                const scope = createDefaultDiScope<RegisteredDependencies>(descriptors);
                const promise = resolveAsyncDependencies(scope, ["first", "second"]);

                expect(firstFactory).toHaveBeenCalledTimes(1);
                expect(secondFactory).toHaveBeenCalledTimes(1);
                expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Pending);

                second[TrackedPromise.resolve](2);
                first[TrackedPromise.resolve](1);

                expect(await promise).toEqual([1, 2]);
                expect(resolveAsyncDependencies(scope, ["first", "second"])[TrackedPromise.status])
                    .toBe(TrackedPromiseStatus.Success);
            }
        );

        it
        (
            "awaits async collection members while preserving promise-valued sync members",
            async () =>
            {
                const pending = TrackedPromise.controlled<number>();
                const settled = TrackedPromise.resolved(2);
                const promiseValue = Promise.resolve(3);
                const descriptors = new Map<string, DependencyDescriptorsBucket>()
                    .set("collection", [
                        {
                            key: "collection",
                            type: DependencyDescriptorType.FactoryAsync,
                            lifetime: DependencyLifetime.Singleton,
                            factory: () => pending
                        },
                        {
                            key: "collection",
                            type: DependencyDescriptorType.FactoryAsync,
                            lifetime: DependencyLifetime.Singleton,
                            factory: () => settled
                        },
                        {
                            key: "collection",
                            type: DependencyDescriptorType.Value,
                            lifetime: DependencyLifetime.Singleton,
                            value: promiseValue
                        }
                    ]);
                const scope = createDefaultDiScope<RegisteredDependencies>(descriptors);
                const promise = resolveAsyncDependencies(scope, [["collection"]]);

                expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Pending);
                pending[TrackedPromise.resolve](1);

                const [collection] = await promise;

                expect(collection).toEqual([1, 2, promiseValue]);

                const next = resolveAsyncDependencies(scope, [["collection"]]);

                expect(next[TrackedPromise.status]).toBe(TrackedPromiseStatus.Success);
                expect(await next).toEqual([[1, 2, promiseValue]]);
            }
        );
    }
);
