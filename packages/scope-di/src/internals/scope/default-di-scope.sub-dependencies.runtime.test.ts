import { describe, expect, it } from "@jest/globals";
import { AllowedDependencyKey, DependencyDescriptor, DependencyDescriptorType, DependencyLifetime } from "../../types";
import { createDefaultDiScope } from "./default-di-scope.test-helpers";

describe
(
    "default-di-scope: Sub-dependencies",
    () =>
    {
        it
        (
            "Resolving dependent classes uses optimized arity paths for four, five, and fallback dependencies",
            () =>
            {
                class Dependency
                {
                    public constructor(public readonly index: number)
                    {
                    }
                }

                class Parent
                {
                    public readonly dependencies: unknown[];

                    public constructor(...dependencies: unknown[])
                    {
                        this.dependencies = dependencies;
                    }
                }

                const dependencyKeys = ["d1", "d2", "d3", "d4", "d5", "d6"];
                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>();

                for(let index = 0; index < dependencyKeys.length; ++index)
                {
                    descriptors.set
                    (
                        dependencyKeys[index],
                        [
                            {
                                key: dependencyKeys[index],
                                type: DependencyDescriptorType.Factory,
                                lifetime: DependencyLifetime.Singleton,
                                factory: () => new Dependency(index)
                            }
                        ]
                    );
                }

                descriptors
                    .set
                    (
                        "parent4",
                        [
                            {
                                key: "parent4",
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Transient,
                                subDependenciesKeys: dependencyKeys.slice(0, 4),
                                constructor: Parent
                            }
                        ]
                    )
                    .set
                    (
                        "parent5",
                        [
                            {
                                key: "parent5",
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Transient,
                                subDependenciesKeys: dependencyKeys.slice(0, 5),
                                constructor: Parent
                            }
                        ]
                    )
                    .set
                    (
                        "parent6",
                        [
                            {
                                key: "parent6",
                                type: DependencyDescriptorType.Class,
                                lifetime: DependencyLifetime.Transient,
                                subDependenciesKeys: dependencyKeys,
                                constructor: Parent
                            }
                        ]
                    );

                const scope = createDefaultDiScope(descriptors);

                const [parent4, parent5, parent6] = scope.resolveRange("parent4" as never, "parent5" as never, "parent6" as never) as [Parent, Parent, Parent];

                expect(parent4.dependencies).toHaveLength(4);
                expect(parent5.dependencies).toHaveLength(5);
                expect(parent6.dependencies).toHaveLength(6);
            }
        );

        it
        (
            "Resolving dependent factories uses optimized arity paths for two through fallback dependencies",
            () =>
            {
                const dependencyKeys = ["d1", "d2", "d3", "d4", "d5", "d6"];
                const descriptors = new Map<AllowedDependencyKey, DependencyDescriptor[]>();

                for(let index = 0; index < dependencyKeys.length; ++index)
                {
                    descriptors.set
                    (
                        dependencyKeys[index],
                        [
                            {
                                key: dependencyKeys[index],
                                type: DependencyDescriptorType.Value,
                                lifetime: DependencyLifetime.Singleton,
                                value: index
                            }
                        ]
                    );
                }

                for(const count of [2, 3, 4, 5, 6])
                {
                    descriptors.set
                    (
                        `parent${count}`,
                        [
                            {
                                key: `parent${count}`,
                                type: DependencyDescriptorType.Factory,
                                lifetime: DependencyLifetime.Transient,
                                subDependenciesKeys: dependencyKeys.slice(0, count),
                                factory: (...dependencies) => dependencies
                            }
                        ]
                    );
                }

                const scope = createDefaultDiScope(descriptors);

                const [parent2, parent3, parent4, parent5, parent6] = scope.resolveRange
                (
                    "parent2" as never,
                    "parent3" as never,
                    "parent4" as never,
                    "parent5" as never,
                    "parent6" as never
                ) as [unknown[], unknown[], unknown[], unknown[], unknown[]];

                expect(parent2).toStrictEqual([0, 1]);
                expect(parent3).toStrictEqual([0, 1, 2]);
                expect(parent4).toStrictEqual([0, 1, 2, 3]);
                expect(parent5).toStrictEqual([0, 1, 2, 3, 4]);
                expect(parent6).toStrictEqual([0, 1, 2, 3, 4, 5]);
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

                const scope = createDefaultDiScope(descriptors);
                        
                const [promise] = scope.resolveRange(parentKey as never);

                const parent = await (promise as Promise<Parent>);
                
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

                const scope = createDefaultDiScope(descriptors);
        
                const [parent] = scope.resolveRange(parentKey as never) as [Parent];

                expect(parent).toBeInstanceOf(Parent);
                expect(parent.child1).toBeInstanceOf(Child1);
                expect(parent.child2).toBeInstanceOf(Child2);
                expect(parent.child3).toBeInstanceOf(Child3);
                expect(parent.child1.grandChild1).toBeInstanceOf(GrandChild1);
            }
        );
    }
);
