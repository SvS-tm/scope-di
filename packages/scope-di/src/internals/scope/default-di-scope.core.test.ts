import { describe, expect, it } from "@jest/globals";
import { DefaultDiScope } from "./default-di-scope";
import { AllowedDependencyKey, DependencyDescriptor, DependencyDescriptorType, DependencyLifetime } from "../../types";

describe
(
    "default-di-scope: Core resolution",
    () =>
    {
        it
        (
            "Resolving a registered value returns the value",
            () =>
            {
                const key = "Value";
                const value = {};

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Value,
                                lifetime: DependencyLifetime.Singleton,
                                value
                            }
                        ]
                    );

                const scope = new DefaultDiScope(descriptors);

                const resolved = scope.resolve(key as never);

                expect(resolved).toBe(value);
            }
        );

        it
        (
            "Resolving a registered class returns an instance",
            () =>
            {
                const key = "Class";
                class Test {}

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: Test
                            } 
                        ]
                    );

                const scope = new DefaultDiScope(descriptors);

                const resolved = scope.resolve(key as never);

                expect(resolved).toBeInstanceOf(Test);
            }
        );

        it
        (
            "Resolving a registered factory returns its result",
            () =>
            {
                const key = "Factory";
                const value = {};

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Factory,
                                lifetime: DependencyLifetime.Singleton,
                                factory: () => value
                            } 
                        ]
                    );
                
                const scope = new DefaultDiScope(descriptors);

                const resolved = scope.resolve(key as never);

                expect(resolved).toBe(value);
            }
        );

        it
        (
            "Resolving an async class registration returns a Promise and resolves to the expected instance",
            async () =>
            {
                const key = "AsyncClass";
                class Test {}

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.ClassAsync,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: Test
                            } 
                        ]
                    );
                
                const scope = new DefaultDiScope(new Map(descriptors));

                const resolved = scope.resolve(key as never) as Promise<unknown>;

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
                const key = "AsyncFactory";
                const value = {};

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.FactoryAsync,
                                lifetime: DependencyLifetime.Singleton,
                                factory: async () => value
                            } 
                        ]
                    );
                
                const scope = new DefaultDiScope(new Map(descriptors));

                const resolved = scope.resolve(key as never) as Promise<any>;

                expect(resolved).toBeInstanceOf(Promise);

                const instance = await resolved;

                expect(instance).toBe(value);
            }
        );
    }
);
