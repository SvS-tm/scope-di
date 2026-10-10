import { describe, expect, it } from "@jest/globals";
import { UnknownDependencyTypeError } from "../../errors/unknown-dependency-type-error";
import { DependencyDescriptor, DependencyDescriptorType, DependencyLifetime, RegisteredDependencies } from "../../types";
import { DefaultDiScopeBuilder } from "./default-di-scope-builder";

class ArgumentList
{
    public readonly values: unknown[];

    public constructor(...values: unknown[])
    {
        this.values = values;
    }
}

describe
(
    "DefaultDiScopeBuilder descriptor compilation",
    () =>
    {
        it
        (
            "rejects unknown descriptor types during build with their message and cause",
            () =>
            {
                const key = "Key";
                const builder = new DefaultDiScopeBuilder();
                builder.register
                (
                    {
                        key,
                        type: -1 as DependencyDescriptorType,
                        lifetime: DependencyLifetime.Singleton,
                        constructor: ArgumentList
                    } as DependencyDescriptor
                );

                expect(() => builder.build()).toThrow(UnknownDependencyTypeError);

                try
                {
                    builder.build();
                }
                catch (error)
                {
                    expect(error).toBeInstanceOf(UnknownDependencyTypeError);
                    expect((error as Error).message).toBe(`Can not resolve dependency by key ${key} as its type is unknown: -1!`);
                    expect((error as Error).cause).toStrictEqual({ key, type: -1 });
                }
            }
        );

        it
        (
            "compiles every descriptor type and preserves collection registrations",
            async () =>
            {
                const builder = new DefaultDiScopeBuilder<RegisteredDependencies>();
                const descriptors: DependencyDescriptor[] =
                [
                    {
                        key: "value",
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: false
                    },
                    {
                        key: "class",
                        type: DependencyDescriptorType.Class,
                        lifetime: DependencyLifetime.Transient,
                        constructor: ArgumentList,
                        subDependenciesKeys: ["value"]
                    },
                    {
                        key: "factory",
                        type: DependencyDescriptorType.Factory,
                        lifetime: DependencyLifetime.Transient,
                        factory: value => new ArgumentList(value),
                        subDependenciesKeys: ["value"]
                    },
                    {
                        key: "asyncClass",
                        type: DependencyDescriptorType.ClassAsync,
                        lifetime: DependencyLifetime.Transient,
                        constructor: ArgumentList,
                        subDependenciesKeys: ["value"]
                    },
                    {
                        key: "asyncFactory",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Transient,
                        factory: async value => new ArgumentList(value),
                        subDependenciesKeys: ["value"]
                    },
                    {
                        key: "collection",
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 1
                    },
                    {
                        key: "collection",
                        type: DependencyDescriptorType.Value,
                        lifetime: DependencyLifetime.Singleton,
                        value: 2
                    }
                ];

                for (const descriptor of descriptors)
                    builder.register(descriptor);

                const scope = builder.build();

                expect(scope.registry.getDescriptors()).toHaveLength(descriptors.length);

                for (const key of ["class", "factory", "asyncClass", "asyncFactory"])
                {
                    const compiled = scope.registry.resolveSingularDescriptorByKey(key);

                    expect(await compiled.instatiationStrategy(scope)).toEqual(new ArgumentList(false));
                }

                expect(scope.registry.resolveSingularDescriptorByKey("value").instatiationStrategy(scope)).toBe(false);
                expect
                (
                    scope.registry.resolveCollectionDescriptorsByKey("collection")
                        .map(descriptor => descriptor.instatiationStrategy(scope))
                )
                    .toEqual([2, 1]);
            }
        );

        it.each([false, true])
        (
            "compiles larger argument lists with runtime code generation set to %s",
            async allowRuntimeCodeGeneration =>
            {
                const builder = new DefaultDiScopeBuilder<RegisteredDependencies>()
                    .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration);
                builder.register({ key: "value", type: DependencyDescriptorType.Value, lifetime: DependencyLifetime.Singleton, value: 42 });

                const subDependenciesKeys = new Array<string>(6).fill("value");
                const descriptors: DependencyDescriptor[] =
                [
                    {
                        key: "class",
                        type: DependencyDescriptorType.Class,
                        lifetime: DependencyLifetime.Transient,
                        constructor: ArgumentList,
                        subDependenciesKeys
                    },
                    {
                        key: "factory",
                        type: DependencyDescriptorType.Factory,
                        lifetime: DependencyLifetime.Transient,
                        factory: (...values) => new ArgumentList(...values),
                        subDependenciesKeys
                    },
                    {
                        key: "asyncClass",
                        type: DependencyDescriptorType.ClassAsync,
                        lifetime: DependencyLifetime.Transient,
                        constructor: ArgumentList,
                        subDependenciesKeys
                    },
                    {
                        key: "asyncFactory",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Transient,
                        factory: async (...values) => new ArgumentList(...values),
                        subDependenciesKeys
                    }
                ];

                for (const descriptor of descriptors)
                    builder.register(descriptor);

                const scope = builder.build();

                for (const descriptor of descriptors)
                {
                    const compiled = scope.registry.resolveSingularDescriptorByKey(descriptor.key);

                    expect(await compiled.instatiationStrategy(scope)).toEqual(new ArgumentList(42, 42, 42, 42, 42, 42));
                }
            }
        );
    }
);
