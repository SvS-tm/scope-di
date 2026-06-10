import { describe, expect, it } from "@jest/globals";
import { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import { DependencyDescriptor } from "../../types/dependency-descriptor";
import { DependencyDescriptorType, DependencyLifetime } from "../../types";
import { createDefaultDiScope } from "./default-di-scope.test-helpers";

describe
(
    "default-di-scope: Lifetimes",
    () =>
    {
        it
        (
            "Singleton: Resolving the same key twice in the same scope returns the same instance", 
            () => 
            {
                class Dependency {}
                const key = "Key";

                const registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Class,
                                constructor: Dependency,
                                lifetime: DependencyLifetime.Singleton
                            }
                        ]
                    );

                const scope = createDefaultDiScope(registry);

                const [dependency] = scope.resolve(key as never);
                const [dependency1] = scope.resolve(key as never);

                expect(dependency).toBe(dependency1);
            }
        );

        it
        (
            "Singleton: Resolving from a child scope still returns the same instance from the root", 
            () => 
            {
                class Dependency {}
                const key = "Key";

                const registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Class,
                                constructor: Dependency,
                                lifetime: DependencyLifetime.Singleton
                            }
                        ]
                    );

                const scope = createDefaultDiScope(registry);

                const [dependency] = scope.resolve(key as never);

                const childScope = scope.createChildScope();

                const [dependency1] = childScope.resolve(key as never);

                expect(dependency).toBe(dependency1);
            }
        );

        it
        (
            "Scoped: Resolving twice in the same scope returns the same instance", 
            () => 
            {
                class Dependency {}
                const key = "Key";

                const registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Class,
                                constructor: Dependency,
                                lifetime: DependencyLifetime.Scoped
                            }
                        ]
                    );

                const scope = createDefaultDiScope(registry);

                const [dependency] = scope.resolve(key as never);
                const [dependency1] = scope.resolve(key as never);

                expect(dependency).toBe(dependency1);
            }
        );

        it
        (
            "Scoped: Resolving in a child scope gives a different instance", 
            () => 
            {
                class Dependency {}
                const key = "Key";

                const registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Class,
                                constructor: Dependency,
                                lifetime: DependencyLifetime.Scoped
                            }
                        ]
                    );

                const scope = createDefaultDiScope(registry);

                const [dependency] = scope.resolve(key as never);

                const childScope = scope.createChildScope();

                const [dependency1] = childScope.resolve(key as never);

                expect(dependency).not.toBe(dependency1);
            }
        );

        it
        (
            "ScopedInherited: Resolving in a child scope returns the same instance from the nearest ancestor that has it", 
            () => 
            {
                class Dependency {}
                const key = "Key";

                const registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Class,
                                constructor: Dependency,
                                lifetime: DependencyLifetime.ScopedInherited
                            }
                        ]
                    );

                const scope = createDefaultDiScope(registry);

                const [dependency] = scope.resolve(key as never);
                
                const scope1 = scope.createChildScope();
                const scope2 = scope1.createChildScope();

                const [dependency1] = scope2.resolve(key as never);

                expect(dependency).toBe(dependency1);
            }
        );

        it
        (
            "ScopedInherited: If no ancestor has it, it is created in the current scope", 
            () => 
            {
                class Dependency {}
                const key = "Key";

                const registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Class,
                                constructor: Dependency,
                                lifetime: DependencyLifetime.ScopedInherited
                            }
                        ]
                    );

                const scope = createDefaultDiScope(registry);

                const scope1 = scope.createChildScope();
                const scope2 = scope1.createChildScope();

                const [dependency1] = scope2.resolve(key as never);
                const [dependency] = scope.resolve(key as never);

                expect(dependency).not.toBe(dependency1);
            }
        );

        it
        (
            "Transient: Always returns a new instance, even within the same scope", 
            () => 
            {
                class Dependency {}
                const key = "Key";

                const registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        key,
                        [
                            {
                                key,
                                type: DependencyDescriptorType.Class,
                                constructor: Dependency,
                                lifetime: DependencyLifetime.Transient
                            }
                        ]
                    );

                const scope = createDefaultDiScope(registry);

                const [dependency] = scope.resolve(key as never);
                const [dependency1] = scope.resolve(key as never);

                expect(dependency).not.toBe(dependency1);
            }
        );
    }
);
