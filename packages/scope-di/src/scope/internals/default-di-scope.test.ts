import { describe, expect, it } from "@jest/globals";
import { DefaultDiScope } from "./default-di-scope";
import { DependencyDescriptor, DependencyDescriptorType, DependencyLifetime } from "../../types";

describe
(
    "default-di-scope",
    () =>
    {
        it
        (
            "Resolving a registered value returns the value",
            () =>
            {
                const value = {};

                const descriptors = [
                    [
                        "Value",
                        {
                            key: "Value",
                            type: DependencyDescriptorType.Value,
                            lifetime: DependencyLifetime.Singleton,
                            value
                        } satisfies DependencyDescriptor
                    ] as const
                ];

                const scope = new DefaultDiScope(new Map(descriptors));

                const resolved = scope.resolve("Value");

                expect(resolved).toBe(value);
            }
        );

        it
        (
            "Resolving a registered class returns an instance",
            () =>
            {
                class Test { }

                const descriptors = [
                    [
                        "Class",
                        {
                            key: "Class",
                            type: DependencyDescriptorType.Class,
                            lifetime: DependencyLifetime.Singleton,
                            constructor: Test
                        } satisfies DependencyDescriptor
                    ] as const
                ];

                const scope = new DefaultDiScope(new Map(descriptors));

                const resolved = scope.resolve("Class");

                expect(resolved).toBeInstanceOf(Test);
            }
        );

        it
        (
            "Resolving a registered factory returns its result",
            () =>
            {
                const value = {};

                const descriptors = [
                    [
                        "Factory",
                        {
                            key: "Factory",
                            type: DependencyDescriptorType.Factory,
                            lifetime: DependencyLifetime.Singleton,
                            factory: () => value
                        } satisfies DependencyDescriptor
                    ] as const
                ];

                const scope = new DefaultDiScope(new Map(descriptors));

                const resolved = scope.resolve("Factory");

                expect(resolved).toBe(value);
            }
        );

        it
        (
            "Resolving an async class registration returns a Promise and resolves to the expected instance",
            async () =>
            {
                class Test { }

                const descriptors = [
                    [
                        "AsyncClass",
                        {
                            key: "AsyncClass",
                            type: DependencyDescriptorType.ClassAsync,
                            lifetime: DependencyLifetime.Singleton,
                            constructor: Test
                        } satisfies DependencyDescriptor
                    ] as const
                ];

                const scope = new DefaultDiScope(new Map(descriptors));

                const resolved = scope.resolve("AsyncClass");

                expect(resolved).toBeInstanceOf(Promise);

                const instance = await resolved;

                expect(instance).toBeInstanceOf(Test);
            }
        );

        it
        (
            "Resolving an async factory registration returns a Promise and resolves to the expected instance",
            async () =>
            {
                const value = {};

                const descriptors = [
                    [
                        "AsyncFactory",
                        {
                            key: "AsyncFactory",
                            type: DependencyDescriptorType.FactoryAsync,
                            lifetime: DependencyLifetime.Singleton,
                            factory: () => value
                        } satisfies DependencyDescriptor
                    ] as const
                ];

                const scope = new DefaultDiScope(new Map(descriptors));

                const resolved = scope.resolve("AsyncFactory");

                expect(resolved).toBeInstanceOf(Promise);

                const instance = await resolved;

                expect(instance).toBe(value);
            }
        );

        it
        (
            "Resolving a class registration with sub-dependencies injects correct dependencies",
            () =>
            {
                
            }
        )
    }
);