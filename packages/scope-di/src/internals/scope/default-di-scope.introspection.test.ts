import { describe, expect, it } from "@jest/globals";
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
        )
    }
);
