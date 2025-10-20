import { describe, expect, it } from "@jest/globals";
import { DiScope } from "../../abstractions/di-scope";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependenciesCollectionResolutionKey } from "../../types/dependencies-collection-resolution-key";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import { DefaultDiScope } from "./default-di-scope";

describe
(
    "default-di-scope: Collections",
    () =>
    {
        it
        (
            "Resolving a collection key returns an array with one entry per descriptor registered under the mapping key",
            () =>
            {
                const key = "key";

                const dependency1 = {};
                const dependency2 = {};
                const dependency3 = {};

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Factory,
                                lifetime: DependencyLifetime.Singleton,
                                factory: () => dependency3
                            },
                            {
                                key,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: class 
                                {
                                    constructor()
                                    {
                                        return dependency2;
                                    }
                                }
                            },
                            {
                                key,
                                type: DependencyDescriptorType.Value,
                                lifetime: DependencyLifetime.Singleton,
                                value: dependency1
                            }
                        ]
                    );

                const scope = new DefaultDiScope(descriptors) as DiScope<any>;
                
                const [resolved] = scope.resolve([key] as DependenciesCollectionResolutionKey<never>);

                expect(resolved).toHaveLength(3);
                expect(resolved[0]).toBe(dependency3);
                expect(resolved[1]).toBe(dependency2);
                expect(resolved[2]).toBe(dependency1);
            }
        );

        it
        (
            "Registering the same instance twice produces two identical references in the collection",
            () =>
            {
                const key = "key";

                const dependency1 = {};

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Value,
                                lifetime: DependencyLifetime.Singleton,
                                value: dependency1
                            },
                            {
                                key,
                                type: DependencyDescriptorType.Value,
                                lifetime: DependencyLifetime.Singleton,
                                value: dependency1
                            }
                        ]
                    );

                const scope = new DefaultDiScope(descriptors) as DiScope<any>;
                
                const [resolved] = scope.resolve([key] as DependenciesCollectionResolutionKey<never>);

                expect(resolved).toStrictEqual([dependency1, dependency1]);
            }
        );

        it
        (
            "In a sync parent (sync class/factory depends on a collection), injected collection contains promises at async positions (not awaited)",
            () =>
            {
                const key = "key";

                const dependency1 = {};
                const dependency2 = {};
                const dependency3 = {};

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.FactoryAsync,
                                lifetime: DependencyLifetime.Singleton,
                                factory: async () => dependency3
                            },
                            {
                                key,
                                type: DependencyDescriptorType.ClassAsync,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: class 
                                {
                                    constructor()
                                    {
                                        return dependency2;
                                    }
                                }
                            },
                            {
                                key,
                                type: DependencyDescriptorType.Value,
                                lifetime: DependencyLifetime.Singleton,
                                value: dependency1
                            }
                        ]
                    );

                const scope = new DefaultDiScope(descriptors) as DiScope<any>;
                
                const [resolved] = scope.resolve([key] as DependenciesCollectionResolutionKey<never>);

                expect(resolved).toHaveLength(3);
                expect(resolved[0]).toBeInstanceOf(Promise);
                expect(resolved[1]).toBeInstanceOf(Promise);
                expect(resolved[2]).toBe(dependency1);
            }
        );

        it
        (
            "In an async parent (async class/factory depends on a collection), all members are awaited before the parent is invoked",
            async () =>
            {
                const key = "key";

                const dependency1 = {};
                const dependency2 = {};
                const dependency3 = {};

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.FactoryAsync,
                                lifetime: DependencyLifetime.Singleton,
                                factory: async () => dependency3
                            },
                            {
                                key,
                                type: DependencyDescriptorType.ClassAsync,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: class 
                                {
                                    constructor()
                                    {
                                        return dependency2;
                                    }
                                }
                            },
                            {
                                key,
                                type: DependencyDescriptorType.Value,
                                lifetime: DependencyLifetime.Singleton,
                                value: dependency1
                            }
                        ]
                    );

                const scope = new DefaultDiScope(descriptors) as DiScope<any>;
                
                const [resolved] = await scope.resolveAsync([key] as DependenciesCollectionResolutionKey<never>);

                expect(resolved).toHaveLength(3);
                expect(resolved[0]).toBe(dependency3);
                expect(resolved[1]).toBe(dependency2);
                expect(resolved[2]).toBe(dependency1);
            }
        );
    }
);
