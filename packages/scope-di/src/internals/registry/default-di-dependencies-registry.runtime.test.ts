import { describe, expect, it } from "@jest/globals";
import { DependencyNotRegisteredError } from "../../errors";
import { AllowedDependencyKey, DependencyDescriptorType, DependencyLifetime } from "../../types";
import type { RuntimeDependencyDescriptor } from "../../types/internals/runtime-dependency-descriptor";
import { compileTestDescriptor } from "../instantiation-strategies/compilation.test-helpers";
import { DefaultDiDependenciesRegistry } from "./default-di-dependencies-registry";
import type { RuntimeDependencyDescriptorsBucket } from "../../types/internals/runtime-dependency-descriptors-bucket";

describe
(
    "default-di-dependencies-registry",
    () =>
    {
        it
        (
            "lookup indexes preserve snapshot order and support one-item and empty collections",
            () =>
            {
                const descriptor1: RuntimeDependencyDescriptor =
                compileTestDescriptor
                (
                    {
                        key: "collection",
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 1
                    }
                );
                const descriptor2 = compileTestDescriptor({ key: "collection", type: DependencyDescriptorType.Value, lifetime: DependencyLifetime.Singleton, value: 2 });
                const descriptor3 = compileTestDescriptor({ key: "singular", type: DependencyDescriptorType.Value, lifetime: DependencyLifetime.Singleton, value: 3 });
                const registrations = new Map<AllowedDependencyKey, RuntimeDependencyDescriptorsBucket>()
                    .set("collection", [descriptor1, descriptor2])
                    .set("empty", [])
                    .set("singular", descriptor3);
                const registry = new DefaultDiDependenciesRegistry(registrations, false);

                expect(registry.resolveSingularDescriptorByKey("collection")).toBe(descriptor1);
                expect(registry.resolveCollectionDescriptorsByKey("singular")).toStrictEqual([descriptor3]);
                expect(registry.resolveCollectionDescriptorsByKey("empty")).toStrictEqual([]);
                expect(registry.getDescriptors()).toStrictEqual([descriptor1, descriptor2, descriptor3]);
                expect(registry.resolveCollectionDescriptorsByKey("singular"))
                    .toBe(registry.resolveCollectionDescriptorsByKey("singular"));
            }
        );

        it
        (
            "input mutations and enumeration result mutations do not change the registration snapshot",
            () =>
            {
                const descriptor: RuntimeDependencyDescriptor =
                compileTestDescriptor
                (
                    {
                        key: "key",
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 1
                    }
                );
                const bucket = [descriptor];
                const registrations = new Map<AllowedDependencyKey, RuntimeDependencyDescriptorsBucket>()
                    .set("key", bucket);
                const registry = new DefaultDiDependenciesRegistry(registrations, false);

                bucket.length = 0;
                registrations.clear();
                registry.getDescriptors().length = 0;

                expect(registry.resolveSingularDescriptorByKey("key")).toBe(descriptor);
                expect(registry.resolveCollectionDescriptorsByKey("key")).toStrictEqual([descriptor]);
                expect(registry.getDescriptors()).toStrictEqual([descriptor]);
            }
        );

        it
        (
            "getDescriptors includes descriptors backed by direct storage",
            () =>
            {
                const key = "key";
                const descriptor: RuntimeDependencyDescriptor =
                compileTestDescriptor
                (
                    {
                        key,
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 1
                    }
                );

                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, RuntimeDependencyDescriptor>()
                        .set(key, descriptor), false
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
                const descriptor1: RuntimeDependencyDescriptor =
                compileTestDescriptor
                (
                    {
                        key,
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 1
                    }
                );
                const descriptor2: RuntimeDependencyDescriptor =
                compileTestDescriptor
                (
                    {
                        key,
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 2
                    }
                );

                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>()
                        .set(key, [descriptor1, descriptor2]), false
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
                const descriptor1: RuntimeDependencyDescriptor =
                compileTestDescriptor
                (
                    {
                        key,
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 1
                    }
                );
                const descriptor2: RuntimeDependencyDescriptor =
                compileTestDescriptor
                (
                    {
                        key,
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 2
                    }
                );

                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>()
                        .set(key, [descriptor1, descriptor2]), false
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
                const descriptor: RuntimeDependencyDescriptor =
                compileTestDescriptor
                (
                    {
                        key,
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 1
                    }
                );

                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, RuntimeDependencyDescriptor>()
                        .set(key, descriptor), false
                );

                const resolved = registry.resolveDescriptorsByKey(key);

                expect(resolved).toBe(descriptor);
            }
        );

        it
        (
            "resolveDescriptorsByKey reuses the one-item bucket for collection mapping keys",
            () =>
            {
                const key = "key";
                const descriptor: RuntimeDependencyDescriptor =
                compileTestDescriptor
                (
                    {
                        key,
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 1
                    }
                );

                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, RuntimeDependencyDescriptor>()
                        .set(key, descriptor), false
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
                const descriptor1: RuntimeDependencyDescriptor =
                compileTestDescriptor
                (
                    {
                        key: key1,
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 1
                    }
                );
                const descriptor2: RuntimeDependencyDescriptor =
                compileTestDescriptor
                (
                    {
                        key: key2,
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 2
                    }
                );
                const descriptor3: RuntimeDependencyDescriptor =
                compileTestDescriptor
                (
                    {
                        key: key2,
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 3
                    }
                );

                const registry = new DefaultDiDependenciesRegistry
                (
                    new Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>()
                        .set(key1, [descriptor1])
                        .set(key2, [descriptor2, descriptor3]), false
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
                const registry = new DefaultDiDependenciesRegistry(new Map(), false);

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
                    new Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>()
                        .set
                        (
                            key,
                            [
                                compileTestDescriptor
                                (
                                    {
                                        key,
                                        type: DependencyDescriptorType.FactoryAsync,
                                        lifetime: DependencyLifetime.Singleton,
                                        factory: async () => ({})
                                    }
                                )
                            ]
                        ), false
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
                    new Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>()
                        .set
                        (
                            key,
                            [
                                compileTestDescriptor
                                (
                                    {
                                        key,
                                        type: DependencyDescriptorType.Value,
                                        lifetime: DependencyLifetime.Singleton,
                                        value: {}
                                    }
                                ),
                                compileTestDescriptor
                                (
                                    {
                                        key,
                                        type: DependencyDescriptorType.ClassAsync,
                                        lifetime: DependencyLifetime.Singleton,
                                        constructor: class {}
                                    }
                                )
                            ]
                        ), false
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
                    new Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>()
                        .set
                        (
                            key,
                            [
                                compileTestDescriptor
                                (
                                    {
                                        key,
                                        type: DependencyDescriptorType.Value,
                                        lifetime: DependencyLifetime.Singleton,
                                        value: {}
                                    }
                                )
                            ]
                        ), false
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
                const registry = new DefaultDiDependenciesRegistry(new Map(), false);

                expect(() => registry.resolveDescriptorsByKey("missing")).toThrow(DependencyNotRegisteredError);
                expect(() => registry.resolveDescriptorsByKey(["missing"])).toThrow(DependencyNotRegisteredError);
            }
        );
    }
);
