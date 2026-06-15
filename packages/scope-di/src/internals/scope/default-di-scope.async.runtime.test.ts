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

                const resolved = await scope.resolveRangeAsync();

                expect(resolved).toStrictEqual([]);
            }
        );

        it
        (
            "resolveAsync passes optimized arity dependency lists to async class descriptors",
            async () =>
            {
                class Parent
                {
                    public readonly dependencies: unknown[];

                    public constructor(...dependencies: unknown[])
                    {
                        this.dependencies = dependencies;
                    }
                }

                const dependencyKeys = ["d1", "d2", "d3", "d4", "d5", "d6"];
                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>();

                for(let index = 0; index < dependencyKeys.length; ++index)
                {
                    descriptors.set
                    (
                        dependencyKeys[index],
                        [
                            {
                                key: dependencyKeys[index],
                                type: DependencyDescriptorType.Value,
                                lifetime: DependencyLifetime.Singleton,
                                value: index
                            }
                        ]
                    );
                }

                for(const count of [0, 2, 3, 4, 5, 6])
                {
                    descriptors.set
                    (
                        `parent${count}`,
                        [
                            {
                                key: `parent${count}`,
                                type: DependencyDescriptorType.ClassAsync,
                                lifetime: DependencyLifetime.Transient,
                                subDependenciesKeys: dependencyKeys.slice(0, count),
                                constructor: Parent
                            }
                        ]
                    );
                }

                const scope = createDefaultDiScope(descriptors);

                const [parent0, parent2, parent3, parent4, parent5, parent6] = await scope.resolveRangeAsync
                (
                    "parent0" as never,
                    "parent2" as never,
                    "parent3" as never,
                    "parent4" as never,
                    "parent5" as never,
                    "parent6" as never
                ) as [Parent, Parent, Parent, Parent, Parent, Parent];

                expect(parent0.dependencies).toStrictEqual([]);
                expect(parent2.dependencies).toStrictEqual([0, 1]);
                expect(parent3.dependencies).toStrictEqual([0, 1, 2]);
                expect(parent4.dependencies).toStrictEqual([0, 1, 2, 3]);
                expect(parent5.dependencies).toStrictEqual([0, 1, 2, 3, 4]);
                expect(parent6.dependencies).toStrictEqual([0, 1, 2, 3, 4, 5]);
            }
        );

        it
        (
            "resolveAsync passes optimized arity dependency lists to async factory descriptors",
            async () =>
            {
                const dependencyKeys = ["d1", "d2", "d3", "d4", "d5", "d6"];
                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>();

                for(let index = 0; index < dependencyKeys.length; ++index)
                {
                    descriptors.set
                    (
                        dependencyKeys[index],
                        [
                            {
                                key: dependencyKeys[index],
                                type: DependencyDescriptorType.Value,
                                lifetime: DependencyLifetime.Singleton,
                                value: index
                            }
                        ]
                    );
                }

                for(const count of [0, 2, 3, 4, 5, 6])
                {
                    descriptors.set
                    (
                        `parent${count}`,
                        [
                            {
                                key: `parent${count}`,
                                type: DependencyDescriptorType.FactoryAsync,
                                lifetime: DependencyLifetime.Transient,
                                subDependenciesKeys: dependencyKeys.slice(0, count),
                                factory: async (...dependencies) => dependencies
                            }
                        ]
                    );
                }

                const scope = createDefaultDiScope(descriptors);

                const [parent0, parent2, parent3, parent4, parent5, parent6] = await scope.resolveRangeAsync
                (
                    "parent0" as never,
                    "parent2" as never,
                    "parent3" as never,
                    "parent4" as never,
                    "parent5" as never,
                    "parent6" as never
                ) as [unknown[], unknown[], unknown[], unknown[], unknown[], unknown[]];

                expect(parent0).toStrictEqual([]);
                expect(parent2).toStrictEqual([0, 1]);
                expect(parent3).toStrictEqual([0, 1, 2]);
                expect(parent4).toStrictEqual([0, 1, 2, 3]);
                expect(parent5).toStrictEqual([0, 1, 2, 3, 4]);
                expect(parent6).toStrictEqual([0, 1, 2, 3, 4, 5]);
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

                const [resolvedValue, resolvedDependency] = await scope.resolveRangeAsync(key1 as never, key2 as never);

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

                await expect(scope.resolveRangeAsync(key as never)).rejects.toBe(error);
            }
        );

        it
        (
            "resolveAsync retries a rejected singleton async dependency",
            async () =>
            {
                const key = "key";
                const error = new Error("Factory failed");
                const value = {};
                const factory = jest.fn<() => Promise<object>>()
                    .mockRejectedValueOnce(error)
                    .mockResolvedValue(value);

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

                await expect(scope.resolveRangeAsync(key as never)).rejects.toBe(error);
                
                const [dependency] = await scope.resolveRangeAsync(key as never);

                expect(dependency).toBe(value);
                expect(factory).toHaveBeenCalledTimes(2);
            }
        );

        it
        (
            "resolveAsync shares the same pending singleton rejection between parallel requests before retrying",
            async () =>
            {
                const key = "key";
                const error = new Error("Factory failed");
                const pendingDependency = TrackedPromise.controlled<object>();
                const value = {};
                const factory = jest.fn<() => Promise<object>>()
                    .mockReturnValueOnce(pendingDependency)
                    .mockResolvedValue(value);

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

                const dependency1 = scope.resolveRangeAsync(key as never);
                const dependency2 = scope.resolveRangeAsync(key as never);

                expect(factory).toHaveBeenCalledTimes(1);

                pendingDependency[TrackedPromise.reject](error);

                await expect(dependency1).rejects.toBe(error);
                await expect(dependency2).rejects.toBe(error);

                const [dependency] = await scope.resolveRangeAsync(key as never);

                expect(dependency).toBe(value);
                expect(factory).toHaveBeenCalledTimes(2);
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

                await expect(scope.resolveRangeAsync(parentKey as never)).rejects.toBe(error);
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

                const [dependency1] = await scope.resolveRangeAsync(key as never);
                const [dependency2] = await scope.resolveRangeAsync(key as never);

                expect(dependency1).toBe(value);
                expect(dependency2).toBe(value);
                expect(factory).toHaveBeenCalledTimes(1);
            }
        );

        it
        (
            "resolveAsync resolves async class descriptors without sub-dependencies",
            async () =>
            {
                const key = "key";

                class Dependency {}

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.ClassAsync,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: Dependency
                            }
                        ]
                    );

                const scope = createDefaultDiScope(descriptors);

                const [dependency] = await scope.resolveRangeAsync(key as never);

                expect(dependency).toBeInstanceOf(Dependency);
            }
        );

        it
        (
            "resolveAsync resolves async factory descriptors without sub-dependencies",
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

                const [dependency] = await scope.resolveRangeAsync(key as never);

                expect(dependency).toBe(value);
                expect(factory).toHaveBeenCalledTimes(1);
            }
        );

        it
        (
            "resolveAsync passes settled async sub-dependencies to async class descriptors",
            async () =>
            {
                const childKey = "child";
                const parentKey = "parent";

                class Child {}

                class Parent
                {
                    public constructor(public readonly child: Child)
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
                                type: DependencyDescriptorType.ClassAsync,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: Child
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

                const [child] = await scope.resolveRangeAsync(childKey as never);
                const [parent] = await scope.resolveRangeAsync(parentKey as never);

                expect(parent).toBeInstanceOf(Parent);
                expect((parent as Parent).child).toBe(child);
            }
        );

        it
        (
            "resolveAsync passes settled async sub-dependencies to async factory descriptors",
            async () =>
            {
                const childKey = "child";
                const parentKey = "parent";
                const factory = jest.fn<(child: object) => Promise<object>>(async (child) => ({ child }));

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        childKey,
                        [
                            {
                                key: childKey,
                                type: DependencyDescriptorType.FactoryAsync,
                                lifetime: DependencyLifetime.Singleton,
                                factory: async () => ({})
                            }
                        ]
                    )
                    .set
                    (
                        parentKey,
                        [
                            {
                                key: parentKey,
                                type: DependencyDescriptorType.FactoryAsync,
                                lifetime: DependencyLifetime.Singleton,
                                subDependenciesKeys: [childKey],
                                factory
                            }
                        ]
                    );

                const scope = createDefaultDiScope(descriptors);

                const [child] = await scope.resolveRangeAsync(childKey as never);
                const [parent] = await scope.resolveRangeAsync(parentKey as never);

                expect(parent).toStrictEqual({ child });
                expect(factory).toHaveBeenCalledWith(child);
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

                const [promise1] = scope.resolveRange(key as never);
                const [promise2] = scope.resolveRange(key as never);

                expect(promise1).toBe(promise2);
                expect(factory).toHaveBeenCalledTimes(1);
                expect((promise1 as TrackedPromise<object>)[TrackedPromise.status]).toBe(TrackedPromiseStatus.Pending);
            }
        );
    }
);
