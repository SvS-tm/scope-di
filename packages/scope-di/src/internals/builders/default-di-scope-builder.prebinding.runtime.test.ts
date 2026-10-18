import { DefaultDiScope } from "../scope/default-di-scope";
import { describe, expect, it, jest } from "@jest/globals";
import { TrackedPromise } from "@svs-tm/system";
import { DependencyNotRegisteredError } from "../../errors";
import { DependencyDescriptorType, DependencyLifetime } from "../../types";
import type { DependencyDescriptor, DependencyResolutionKey, RegisteredDependencies } from "../../types";
import { DefaultDiScopeBuilder } from "./default-di-scope-builder";

class Target
{
    public constructor(public readonly values: unknown[])
    {
    }
}

const descriptorTypes =
[
    DependencyDescriptorType.Class,
    DependencyDescriptorType.Factory,
    DependencyDescriptorType.ClassAsync,
    DependencyDescriptorType.FactoryAsync
];

function createTargetDescriptor(type: DependencyDescriptorType, keys: DependencyResolutionKey<string>[]): DependencyDescriptor
{
    class ConstructedTarget extends Target
    {
        public constructor(...values: unknown[])
        {
            super(values);
        }
    }

    const metadata = { key: "target", lifetime: DependencyLifetime.Transient, subDependenciesKeys: keys };

    switch (type)
    {
        case DependencyDescriptorType.Class:
        case DependencyDescriptorType.ClassAsync:
            return { ...metadata, type, constructor: ConstructedTarget };
        case DependencyDescriptorType.Factory:
            return { ...metadata, type, factory: (...values) => new Target(values) };
        case DependencyDescriptorType.FactoryAsync:
            return { ...metadata, type, factory: async (...values) => new Target(values) };
        default:
            throw new Error("Unsupported test descriptor type");
    }
}

describe
(
    "DefaultDiScopeBuilder prebound dependencies",
    () =>
    {
        it.each(descriptorTypes.flatMap(type => [false, true].flatMap(codeGeneration => [1, 6, 8].map(count => ({ type, codeGeneration, count })))))
        (
            "prebinds forward registrations and preserves collections for $type / codegen $codeGeneration / $count arguments",
            async ({ type, codeGeneration, count }) =>
            {
                const builder = new DefaultDiScopeBuilder<RegisteredDependencies>();
                builder.setAllowRuntimeCodeGeneration(codeGeneration);
                const keys: DependencyResolutionKey<string>[] = Array.from({ length: count }, (_, index) => index === 0 ? ["collection"] : "value");
                builder.register(createTargetDescriptor(type, keys));
                builder.register({ key: "collection", type: DependencyDescriptorType.Factory, lifetime: DependencyLifetime.Transient, factory: () => ({}) });
                builder.register({ key: "value", type: DependencyDescriptorType.Value, lifetime: DependencyLifetime.Singleton, value: 42 });
                const scope = builder.build() as DefaultDiScope<RegisteredDependencies>;
                const descriptor = scope.registry.resolveSingularDescriptorByKey("target");
                const singularLookup = jest.spyOn(scope.registry, "resolveSingularDescriptorByKey");
                const collectionLookup = jest.spyOn(scope.registry, "resolveCollectionDescriptorsByKey");

                const first = await descriptor.instatiationStrategy(scope) as Target;
                const second = await descriptor.instatiationStrategy(scope) as Target;
                const firstCollection = first.values[0] as unknown[];
                const secondCollection = second.values[0] as unknown[];

                expect(singularLookup).not.toHaveBeenCalled();
                expect(collectionLookup).not.toHaveBeenCalled();
                expect(first.values.slice(1)).toEqual(new Array(count - 1).fill(42));
                expect(firstCollection).toHaveLength(1);
                expect(firstCollection).not.toBe(secondCollection);
                expect(firstCollection[0]).not.toBe(secondCollection[0]);
                firstCollection.push("caller mutation");
                expect(secondCollection).toHaveLength(1);
            }
        );

        it.each(descriptorTypes.flatMap(type => ["missing", ["missing"]].map(key => ({ type, key: key as DependencyResolutionKey<string> }))))
        (
            "rejects missing declared dependencies during build for $type / $key",
            ({ type, key }) =>
            {
                const builder = new DefaultDiScopeBuilder<RegisteredDependencies>();
                builder.register(createTargetDescriptor(type, [key]));

                expect(() => builder.build()).toThrow(new DependencyNotRegisteredError("missing"));
            }
        );

        it.each(descriptorTypes)
        (
            "uses the executing child scope's instance cache for %s",
            async type =>
            {
                const builder = new DefaultDiScopeBuilder<RegisteredDependencies>();
                builder.register(createTargetDescriptor(type, ["dependency"]));
                builder.register({ key: "dependency", type: DependencyDescriptorType.Factory, lifetime: DependencyLifetime.Scoped, factory: () => ({}) });
                const root = builder.build();
                const firstScope = root.createChildScope();
                const secondScope = root.createChildScope();
                const first = await firstScope.resolveAsync("target") as Target;
                const repeated = await firstScope.resolveAsync("target") as Target;
                const second = await secondScope.resolveAsync("target") as Target;

                expect(first).not.toBe(repeated);
                expect(first.values[0]).toBe(repeated.values[0]);
                expect(first.values[0]).not.toBe(second.values[0]);
            }
        );

        it.each([DependencyDescriptorType.ClassAsync, DependencyDescriptorType.FactoryAsync])
        (
            "keeps concurrent pending collection resolutions independent for %s",
            async type =>
            {
                const pending: ReturnType<typeof TrackedPromise.controlled<number>>[] = [];
                const builder = new DefaultDiScopeBuilder<RegisteredDependencies>();
                builder.register(createTargetDescriptor(type, [["collection"]]));
                builder.register
                (
                    {
                        key: "collection",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Transient,
                        factory: () =>
                        {
                            const promise = TrackedPromise.controlled<number>();
                            pending.push(promise);

                            return promise;
                        }
                    }
                );
                const scope = builder.build() as DefaultDiScope<RegisteredDependencies>;
                const first = scope.resolveAsync("target");
                const second = scope.resolveAsync("target");
                expect(pending).toHaveLength(2);
                pending[1][TrackedPromise.resolve](2);
                pending[0][TrackedPromise.resolve](1);
                const firstResult = await first as Target;
                const secondResult = await second as Target;

                expect(firstResult.values).toEqual([[1]]);
                expect(secondResult.values).toEqual([[2]]);
                expect(firstResult.values[0]).not.toBe(secondResult.values[0]);
            }
        );

        it
        (
            "does not rebind an earlier scope when the same builder is built again",
            () =>
            {
                const builder = new DefaultDiScopeBuilder<RegisteredDependencies>();
                builder.register(createTargetDescriptor(DependencyDescriptorType.Factory, ["value"]));
                builder.register({ key: "value", type: DependencyDescriptorType.Value, lifetime: DependencyLifetime.Singleton, value: 1 });
                const firstScope = builder.build();
                expect((firstScope.resolve("target") as Target).values).toEqual([1]);
                builder.register({ key: "value", type: DependencyDescriptorType.Value, lifetime: DependencyLifetime.Singleton, value: 2 });
                const secondScope = builder.build();

                expect((secondScope.resolve("target") as Target).values).toEqual([2]);
                expect((firstScope.resolve("target") as Target).values).toEqual([1]);
            }
        );
    }
);
