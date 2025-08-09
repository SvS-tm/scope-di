import { describe, expect, it } from "@jest/globals";
import { AllowedDependencyKey, DependencyDescriptor, DependencyDescriptorType, DependencyLifetime } from "../../types";
import { DefaultDiScope } from "./default-di-scope";

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

                const resolved = scope.resolve(key as any);

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

                const resolved = scope.resolve(key as any);

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

                const resolved = scope.resolve(key as any);

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

                const resolved = scope.resolve(key as any) as Promise<unknown>;

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

                const resolved = scope.resolve(key as any) as Promise<any>;

                expect(resolved).toBeInstanceOf(Promise);

                const instance = await resolved;

                expect(instance).toBe(value);
            }
        );

        it
        (
            "Resolving a registered class resolves async/sync dependencies correctly",
            async () =>
            {
                class GrandChild1 {}
                class Child1 
                {
                    public constructor(public readonly grandChild1: GrandChild1)
                    {
                    }
                }
                class Child2 {}
                class Child3 {}
                class Parent 
                {
                    public constructor
                    (
                        public readonly child1: Child1, 
                        public readonly child2: Child2, 
                        public readonly child3: Child3
                    )
                    {
                    }
                }

                const [grandChild1Key, child1Key, child2Key, child3Key, parentKey] = 
                [
                    "GrandChild1", 
                    "Child1", 
                    "Child2", 
                    "Child3", 
                    "Parent"
                ];

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        grandChild1Key, 
                        [
                            {
                                key: grandChild1Key,
                                type: DependencyDescriptorType.FactoryAsync,
                                lifetime: DependencyLifetime.Singleton,
                                factory: () => new Promise((resolve) => setTimeout(resolve, 1000, new GrandChild1()))
                            } 
                        ]
                    )
                    .set
                    (
                        child1Key, 
                        [
                            {
                                key: child1Key,
                                type: DependencyDescriptorType.ClassAsync,
                                lifetime: DependencyLifetime.Singleton,
                                subDependenciesKeys: [grandChild1Key],
                                constructor: Child1
                            } 
                        ]
                    )
                    .set
                    (
                        child2Key, 
                        [
                            {
                                key: child2Key,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: Child2
                            } 
                        ]
                    )
                    .set
                    (
                        child3Key, 
                        [
                            {
                                key: child3Key,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: Child3
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
                                subDependenciesKeys: [child1Key, child2Key, child3Key],
                                constructor: Parent
                            } 
                        ]
                    );

                const scope = new DefaultDiScope(descriptors);
                        
                const parent = await (scope.resolve(parentKey as any) as Promise<Parent>);
                
                expect(parent).toBeInstanceOf(Parent);
                expect(parent.child1).toBeInstanceOf(Child1);
                expect(parent.child2).toBeInstanceOf(Child2);
                expect(parent.child3).toBeInstanceOf(Child3);
                expect(parent.child1.grandChild1).toBeInstanceOf(GrandChild1);
            }
        );

        it
        (
            "Resolving a registered class resolves dependencies correctly",
            () =>
            {
                class GrandChild1 {}
                class Child1 
                {
                    public constructor(public readonly grandChild1: GrandChild1)
                    {
                    }
                }
                class Child2 {}
                class Child3 {}
                class Parent 
                {
                    public constructor
                    (
                        public readonly child1: Child1, 
                        public readonly child2: Child2, 
                        public readonly child3: Child3
                    )
                    {
                    }
                }

                const [grandChild1Key, child1Key, child2Key, child3Key, parentKey] = 
                [
                    "GrandChild1", 
                    "Child1", 
                    "Child2", 
                    "Child3", 
                    "Parent"
                ];

                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>()
                    .set
                    (
                        grandChild1Key, 
                        [
                            {
                                key: grandChild1Key,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: GrandChild1
                            } 
                        ]
                    )
                    .set
                    (
                        child1Key, 
                        [
                            {
                                key: child1Key,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                subDependenciesKeys: [grandChild1Key],
                                constructor: Child1
                            } 
                        ]
                    )
                    .set
                    (
                        child2Key, 
                        [
                            {
                                key: child2Key,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: Child2
                            } 
                        ]
                    )
                    .set
                    (
                        child3Key, 
                        [
                            {
                                key: child3Key,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                constructor: Child3
                            } 
                        ]
                    )
                    .set
                    (
                        parentKey, 
                        [
                            {
                                key: parentKey,
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Singleton,
                                subDependenciesKeys: [child1Key, child2Key, child3Key],
                                constructor: Parent
                            } 
                        ]
                    );

                const scope = new DefaultDiScope(descriptors);
        
                const parent = scope.resolve(parentKey as any) as Parent;

                expect(parent).toBeInstanceOf(Parent);
                expect(parent.child1).toBeInstanceOf(Child1);
                expect(parent.child2).toBeInstanceOf(Child2);
                expect(parent.child3).toBeInstanceOf(Child3);
                expect(parent.child1.grandChild1).toBeInstanceOf(GrandChild1);
            }
        );
    }
);
