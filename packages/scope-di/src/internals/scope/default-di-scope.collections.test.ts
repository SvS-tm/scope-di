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
        /*
            + Resolving a collection key returns an array with one entry per descriptor registered under the mapping key.
            + Verify array order matches your registry rules (e.g., latest-first if that's how you populate arrays).
            + Duplicates allowed: registering the same instance twice produces two identical references in the collection.
            • In a sync parent (sync class/factory depends on a collection), injected collection contains promises at async positions (not awaited).
            • In an async parent (async class/factory depends on a collection), all members are awaited before the parent is invoked.
         */
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
                
                const resolved = scope.resolve([key] as DependenciesCollectionResolutionKey<never>);

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
                
                const resolved = scope.resolve([key] as DependenciesCollectionResolutionKey<never>);

                expect(resolved).toStrictEqual([dependency1, dependency1]);
            }
        );
    }
);
