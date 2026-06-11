import { describe, expect, it, jest } from "@jest/globals";
import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { AllowedDependencyKey, DependencyDescriptor, DependencyDescriptorType, DependencyLifetime } from "../../types";
import { createDefaultDiScope } from "./default-di-scope.test-helpers";

describe
(
    "default-di-scope: Async resolution",
    () =>
    {
        it
        (
            "resolveAsync without keys returns an empty dependency list",
            async () =>
            {
                const scope = createDefaultDiScope();

                const resolved = await scope.resolveAsync();

                expect(resolved).toStrictEqual([]);
            }
        );

        it
        (
            "resolveAsync resolves sync descriptors without changing their values",
            async () =>
            {
                const key1 = "key1";
                const key2 = "key2";
                const value = {};
                class Dependency {}

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key1,
                        [
                            {
                                key: key1,
                                type: DependencyDescriptorType.Value,
                                lifetime: DependencyLifetime.Singleton,
                                value
                            }
                        ]
                    )
                    .set
                    (
                        key2,
                        [
                            {
                                key: key2,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: Dependency
                            }
                        ]
                    );

                const scope = createDefaultDiScope(descriptors);

                const [resolvedValue, resolvedDependency] = await scope.resolveAsync(key1 as never, key2 as never);

                expect(resolvedValue).toBe(value);
                expect(resolvedDependency).toBeInstanceOf(Dependency);
            }
        );

        it
        (
            "resolveAsync rejects when an async factory rejects",
            async () =>
            {
                const key = "key";
                const error = new Error("Factory failed");

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.FactoryAsync,
                                lifetime: DependencyLifetime.Singleton,
                                factory: async () => { throw error; }
                            }
                        ]
                    );

                const scope = createDefaultDiScope(descriptors);

                await expect(scope.resolveAsync(key as never)).rejects.toBe(error);
            }
        );

        it
        (
            "resolveAsync rejects when an async parent dependency waits on a rejected sub-dependency",
            async () =>
            {
                const childKey = "child";
                const parentKey = "parent";
                const error = new Error("Child failed");

                class Parent
                {
                    public constructor(public readonly child: unknown)
                    {
                    }
                }

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        childKey,
                        [
                            {
                                key: childKey,
                                type: DependencyDescriptorType.FactoryAsync,
                                lifetime: DependencyLifetime.Singleton,
                                factory: async () => { throw error; }
                            }
                        ]
                    )
                    .set
                    (
                        parentKey,
                        [
                            {
                                key: parentKey,
                                type: DependencyDescriptorType.ClassAsync,
                                lifetime: DependencyLifetime.Singleton,
                                subDependenciesKeys: [childKey],
                                constructor: Parent
                            }
                        ]
                    );

                const scope = createDefaultDiScope(descriptors);

                await expect(scope.resolveAsync(parentKey as never)).rejects.toBe(error);
            }
        );

        it
        (
            "resolveAsync reuses a singleton async dependency instead of invoking its factory again",
            async () =>
            {
                const key = "key";
                const value = {};
                const factory = jest.fn<() => Promise<object>>().mockResolvedValue(value);

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.FactoryAsync,
                                lifetime: DependencyLifetime.Singleton,
                                factory
                            }
                        ]
                    );

                const scope = createDefaultDiScope(descriptors);

                const [dependency1] = await scope.resolveAsync(key as never);
                const [dependency2] = await scope.resolveAsync(key as never);

                expect(dependency1).toBe(value);
                expect(dependency2).toBe(value);
                expect(factory).toHaveBeenCalledTimes(1);
            }
        );

        it
        (
            "resolve returns the cached singleton async promise while it is pending",
            () =>
            {
                const key = "key";
                const dependency = TrackedPromise.controlled<object>();
                const factory = jest.fn<() => Promise<object>>(() => dependency);

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.FactoryAsync,
                                lifetime: DependencyLifetime.Singleton,
                                factory
                            }
                        ]
                    );

                const scope = createDefaultDiScope(descriptors);

                const [promise1] = scope.resolve(key as never);
                const [promise2] = scope.resolve(key as never);

                expect(promise1).toBe(promise2);
                expect(factory).toHaveBeenCalledTimes(1);
                expect((promise1 as TrackedPromise<object>)[TrackedPromise.status]).toBe(TrackedPromiseStatus.Pending);
            }
        );
    }
);
