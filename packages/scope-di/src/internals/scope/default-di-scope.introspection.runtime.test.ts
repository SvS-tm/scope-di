import { describe, expect, it } from "@jest/globals";
import { ChancyValue } from "@svs-tm/system";
import { DependencyDescriptor } from "../../types/dependency-descriptor";
import { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import { DependencyDescriptorType, DependencyLifetime } from "../../types";
import { createDefaultDiScope } from "./default-di-scope.test-helpers";

describe
(
    "default-di-scope: Introspection",
    () =>
    {
       it
       (
            "Empty registry: returns an empty array when no keys/descriptors are present", 
            () => 
            {
                const scope = createDefaultDiScope();

                const descriptors = scope.registry.getDescriptors();

                expect(descriptors).not.toBeFalsy();
                expect(descriptors).toHaveLength(0);
            }
        );

        it
        (
            "Mixed descriptor types: value/class/factory/async* descriptors all show up as-is with correct fields",
            () =>
            {
                class Dependency1 {}

                const expectedDescriptors: DependencyDescriptor[] = 
                [
                    {
                        key: "0",
                        type: DependencyDescriptorType.Class,
                        constructor: Dependency1,
                        lifetime: DependencyLifetime.Singleton
                    },
                    {
                        key: "1",
                        type: DependencyDescriptorType.ClassAsync,
                        constructor: Dependency1,
                        lifetime: DependencyLifetime.Singleton
                    },
                    {
                        key: "2",
                        type: DependencyDescriptorType.Factory,
                        factory: () => new Dependency1(),
                        lifetime: DependencyLifetime.Singleton
                    },
                    {
                        key: "3",
                        type: DependencyDescriptorType.FactoryAsync,
                        factory: async () => new Dependency1(),
                        lifetime: DependencyLifetime.Singleton
                    },
                    {
                        key: "4",
                        type: DependencyDescriptorType.Value,
                        value: new Dependency1(),
                        lifetime: DependencyLifetime.Singleton
                    }
                ];

                const registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set("0", [expectedDescriptors[0]])
                    .set("1", [expectedDescriptors[1]])
                    .set("3", [expectedDescriptors[2]])
                    .set("4", [expectedDescriptors[3]])
                    .set("5", [expectedDescriptors[4]]);

                const scope = createDefaultDiScope(registry);

                const descriptors = scope.registry.getDescriptors();

                expect(descriptors).toStrictEqual(expectedDescriptors);
            }
        );

        it
        (
            "Shared registry across scopes: a child scope's getDescriptors() matches the parent's (same registry reference)",
            () =>
            {
                class Dependency1 {}

                const expectedDescriptors: DependencyDescriptor[] = 
                [
                    {
                        key: "0",
                        type: DependencyDescriptorType.Class,
                        constructor: Dependency1,
                        lifetime: DependencyLifetime.Singleton
                    },
                    {
                        key: "1",
                        type: DependencyDescriptorType.ClassAsync,
                        constructor: Dependency1,
                        lifetime: DependencyLifetime.Singleton
                    },
                    {
                        key: "2",
                        type: DependencyDescriptorType.Factory,
                        factory: () => new Dependency1(),
                        lifetime: DependencyLifetime.Singleton
                    },
                    {
                        key: "3",
                        type: DependencyDescriptorType.FactoryAsync,
                        factory: async () => new Dependency1(),
                        lifetime: DependencyLifetime.Singleton
                    },
                    {
                        key: "4",
                        type: DependencyDescriptorType.Value,
                        value: new Dependency1(),
                        lifetime: DependencyLifetime.Singleton
                    }
                ];

                const registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set("0", [expectedDescriptors[0]])
                    .set("1", [expectedDescriptors[1]])
                    .set("3", [expectedDescriptors[2]])
                    .set("4", [expectedDescriptors[3]])
                    .set("5", [expectedDescriptors[4]]);

                const scope = createDefaultDiScope(registry);

                const parentDescriptors = scope.registry.getDescriptors();
                
                const childScope = scope.createChildScope();

                const childDescriptors = childScope.registry.getDescriptors();

                expect(parentDescriptors).toStrictEqual(childDescriptors);
            }
        );

        it
        (
            "getDescriptors preserves mapping insertion order and descriptor order while skipping empty collections",
            () =>
            {
                const descriptor1: DependencyDescriptor =
                {
                    key: "b",
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: "b1"
                };

                const descriptor2: DependencyDescriptor =
                {
                    key: "b",
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: "b2"
                };

                const descriptor3: DependencyDescriptor =
                {
                    key: "a",
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: "a1"
                };

                const registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set("empty-before", [])
                    .set("b", [descriptor1, descriptor2])
                    .set("empty-middle", [])
                    .set("a", [descriptor3])
                    .set("empty-after", []);

                const scope = createDefaultDiScope(registry);

                expect(scope.registry.getDescriptors()).toStrictEqual
                (
                    [
                        descriptor1,
                        descriptor2,
                        descriptor3
                    ]
                );
            }
        );

        it
        (
            "findResolvedDependencyByDescriptor returns success for cached falsy values",
            () =>
            {
                const cases: { descriptor: DependencyDescriptor; value: unknown; }[] =
                [
                    {
                        descriptor:
                        {
                            key: "undefined",
                            type: DependencyDescriptorType.Value,
                            lifetime: DependencyLifetime.Singleton,
                            value: undefined
                        },
                        value: undefined
                    },
                    {
                        descriptor:
                        {
                            key: "null",
                            type: DependencyDescriptorType.Value,
                            lifetime: DependencyLifetime.Singleton,
                            value: null
                        },
                        value: null
                    },
                    {
                        descriptor:
                        {
                            key: "false",
                            type: DependencyDescriptorType.Value,
                            lifetime: DependencyLifetime.Singleton,
                            value: false
                        },
                        value: false
                    },
                    {
                        descriptor:
                        {
                            key: "zero",
                            type: DependencyDescriptorType.Value,
                            lifetime: DependencyLifetime.Singleton,
                            value: 0
                        },
                        value: 0
                    },
                    {
                        descriptor:
                        {
                            key: "empty-string",
                            type: DependencyDescriptorType.Value,
                            lifetime: DependencyLifetime.Singleton,
                            value: ""
                        },
                        value: ""
                    }
                ];

                const registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>();

                for (const { descriptor } of cases)
                {
                    registry.set(descriptor.key, [descriptor]);
                }

                const scope = createDefaultDiScope(registry);

                scope.resolveRange(...cases.map(({ descriptor }) => descriptor.key) as never[]);

                for (const { descriptor, value } of cases)
                {
                    const lookupResult = scope.findResolvedDependencyByDescriptor(descriptor);

                    if (!ChancyValue.isSuccess(lookupResult))
                        throw new Error(`Expected ${String(descriptor.key)} to be resolved`);

                    expect(ChancyValue.get(lookupResult)).toBe(value);
                }
            }
        );

        it
        (
            "findResolvedDependencyByDescriptor returns failure for an unresolved falsy value descriptor",
            () =>
            {
                const key = "undefined";
                const descriptor: DependencyDescriptor =
                {
                    key,
                    type: DependencyDescriptorType.Value,
                    lifetime: DependencyLifetime.Singleton,
                    value: undefined
                };

                const registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set(key, [descriptor]);

                const scope = createDefaultDiScope(registry);
                const lookupResult = scope.findResolvedDependencyByDescriptor(descriptor);

                expect(ChancyValue.isSuccess(lookupResult)).toBe(false);
            }
        );

        it
        (
            "findResolvedDependencyByDescriptor finds cached falsy scoped inherited values in ancestors",
            () =>
            {
                const key = "undefined";
                const descriptor: DependencyDescriptor =
                {
                    key,
                    type: DependencyDescriptorType.Factory,
                    lifetime: DependencyLifetime.ScopedInherited,
                    factory: () => undefined
                };

                const registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set(key, [descriptor]);

                const scope = createDefaultDiScope(registry);
                const childScope = scope.createChildScope();

                scope.resolveRange(key as never);

                const lookupResult = childScope.findResolvedDependencyByDescriptor(descriptor);

                if (!ChancyValue.isSuccess(lookupResult))
                    throw new Error("Expected scoped inherited value to be resolved from ancestor");

                expect(ChancyValue.get(lookupResult)).toBeUndefined();
            }
        );
    }
);
