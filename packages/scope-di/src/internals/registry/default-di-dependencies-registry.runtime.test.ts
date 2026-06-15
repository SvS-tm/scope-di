import { describe, expect, it } from "@jest/globals";
import { DependencyNotRegisteredError } from "../../errors";
import { AllowedDependencyKey, DependencyDescriptor, DependencyDescriptorType, DependencyLifetime } from "../../types";
import { DefaultDiDependenciesRegistry } from "./default-di-dependencies-registry";

describe
(
    "default-di-dependencies-registry",
    () =>
    {
        it
        (
            "getDescriptors includes descriptors backed by direct storage",
            () =>
            {
                const key = "key";
                const descriptor: DependencyDescriptor =
                {
                    key,
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: 1
                };

                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, DependencyDescriptor>()
                        .set(key, descriptor)
                );

                expect(registry.getDescriptors()).toStrictEqual([descriptor]);
            }
        );

        it
        (
            "resolveDescriptorsByKey returns the first descriptor for a single mapping key",
            () =>
            {
                const key = "key";
                const descriptor1: DependencyDescriptor =
                {
                    key,
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: 1
                };
                const descriptor2: DependencyDescriptor =
                {
                    key,
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: 2
                };

                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                        .set(key, [descriptor1, descriptor2])
                );

                const resolved = registry.resolveDescriptorsByKey(key);

                expect(resolved).toBe(descriptor1);
            }
        );

        it
        (
            "resolveDescriptorsByKey returns all descriptors for a collection mapping key",
            () =>
            {
                const key = "key";
                const descriptor1: DependencyDescriptor =
                {
                    key,
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: 1
                };
                const descriptor2: DependencyDescriptor =
                {
                    key,
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: 2
                };

                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                        .set(key, [descriptor1, descriptor2])
                );

                const resolved = registry.resolveDescriptorsByKey([key]);

                expect(resolved).toStrictEqual([descriptor1, descriptor2]);
            }
        );

        it
        (
            "resolveDescriptorsByKey returns a direct descriptor for a single mapping key backed by direct storage",
            () =>
            {
                const key = "key";
                const descriptor: DependencyDescriptor =
                {
                    key,
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: 1
                };

                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, DependencyDescriptor>()
                        .set(key, descriptor)
                );

                const resolved = registry.resolveDescriptorsByKey(key);

                expect(resolved).toBe(descriptor);
            }
        );

        it
        (
            "resolveDescriptorsByKey lazily wraps direct descriptor storage for collection mapping keys",
            () =>
            {
                const key = "key";
                const descriptor: DependencyDescriptor =
                {
                    key,
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: 1
                };

                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, DependencyDescriptor>()
                        .set(key, descriptor)
                );

                const resolved = registry.resolveDescriptorsByKey([key]);
                const resolvedAgain = registry.resolveDescriptorsByKey([key]);

                expect(resolved).toStrictEqual([descriptor]);
                expect(resolvedAgain).toBe(resolved);
            }
        );

        it
        (
            "resolveDescriptorsByKeys yields single descriptors and collection descriptors in resolution order",
            () =>
            {
                const key1 = "key1";
                const key2 = "key2";
                const descriptor1: DependencyDescriptor =
                {
                    key: key1,
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: 1
                };
                const descriptor2: DependencyDescriptor =
                {
                    key: key2,
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: 2
                };
                const descriptor3: DependencyDescriptor =
                {
                    key: key2,
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: 3
                };

                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                        .set(key1, [descriptor1])
                        .set(key2, [descriptor2, descriptor3])
                );

                const resolved = [...registry.resolveDescriptorsByKeys(key1, [key2])];

                expect(resolved).toStrictEqual([descriptor1, descriptor2, descriptor3]);
            }
        );

        it
        (
            "resolveDescriptorsByKeys without keys yields no descriptors",
            () =>
            {
                const registry = new DefaultDiDependenciesRegistry(new Map());

                const resolved = [...registry.resolveDescriptorsByKeys()];

                expect(resolved).toStrictEqual([]);
            }
        );

        it
        (
            "isAsyncKey returns true when a single mapping key points to an async descriptor",
            () =>
            {
                const key = "key";
                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                        .set
                        (
                            key,
                            [
                                {
                                    key,
                                    type: DependencyDescriptorType.FactoryAsync,
                                    lifetime: DependencyLifetime.Singleton,
                                    factory: async () => ({})
                                }
                            ]
                        )
                );

                const result = registry.isAsyncKey(key);

                expect(result).toBe(true);
            }
        );

        it
        (
            "isAsyncKey returns true when any collection descriptor is async",
            () =>
            {
                const key = "key";
                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                        .set
                        (
                            key,
                            [
                                {
                                    key,
                                    type: DependencyDescriptorType.Value,
                                    lifetime: DependencyLifetime.Singleton,
                                    value: {}
                                },
                                {
                                    key,
                                    type: DependencyDescriptorType.ClassAsync,
                                    lifetime: DependencyLifetime.Singleton,
                                    constructor: class {}
                                }
                            ]
                        )
                );

                const result = registry.isAsyncKey([key]);

                expect(result).toBe(true);
            }
        );

        it
        (
            "isAsyncKey returns false when descriptors are all sync",
            () =>
            {
                const key = "key";
                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                        .set
                        (
                            key,
                            [
                                {
                                    key,
                                    type: DependencyDescriptorType.Value,
                                    lifetime: DependencyLifetime.Singleton,
                                    value: {}
                                }
                            ]
                        )
                );

                const result = registry.isAsyncKey(key);

                expect(result).toBe(false);
            }
        );

        it
        (
            "resolveDescriptorsByKey throws when the mapping key is not registered",
            () =>
            {
                const registry = new DefaultDiDependenciesRegistry(new Map());

                expect(() => registry.resolveDescriptorsByKey("missing")).toThrow(DependencyNotRegisteredError);
                expect(() => registry.resolveDescriptorsByKey(["missing"])).toThrow(DependencyNotRegisteredError);
            }
        );
    }
);
