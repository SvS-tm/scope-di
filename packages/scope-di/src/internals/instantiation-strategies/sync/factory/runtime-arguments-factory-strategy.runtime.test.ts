import { DependencyDescriptorType, DependencyLifetime } from "../../../../types";
import { getTestRegistrationMaps } from "../../compilation.test-helpers";
import { describe, expect, it } from "@jest/globals";
import { createSyncStrategyChildScope, createSyncStrategyScope, createSyncValueStrategyScope } from "../sync-strategy.test-helpers";
import { createDefaultDiScope } from "../../../scope/default-di-scope.test-helpers";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { createRuntimeArgumentsFactoryStrategy } from "./runtime-arguments-factory-strategy";

function collectArguments(...values: unknown[])
{
    return { values };
}

describe
(
    "createRuntimeArgumentsFactoryStrategy",
    () =>
    {
        it
        (
            "resolves 8 arguments through the supplied scope on every construction",
            () =>
            {
                const root = createSyncStrategyScope();
                const firstScope = createSyncStrategyChildScope(root);
                const secondScope = createSyncStrategyChildScope(root);
                const keys = Array.from({ length: 8 }, (_, index) => index === 0 ? "dependency" : "transient");
                const instantiate = createRuntimeArgumentsFactoryStrategy<ReturnType<typeof collectArguments>>
                (
                    ...getTestRegistrationMaps(root, keys),
                    { key: "target", type: DependencyDescriptorType.Factory, lifetime: DependencyLifetime.Singleton, factory: collectArguments, subDependenciesKeys: keys }
                );

                const first: ReturnType<typeof collectArguments> = instantiate(firstScope);
                const next: ReturnType<typeof collectArguments> = instantiate(firstScope);
                const second: ReturnType<typeof collectArguments> = instantiate(secondScope);

                expect(first.values).toHaveLength(8);
                expect(next.values).toHaveLength(8);
                expect(second.values).toHaveLength(8);
                expect(first).not.toBe(next);
                expect(first.values[0]).toBe(firstScope.resolve("dependency"));
                expect(next.values[0]).toBe(first.values[0]);
                expect(second.values[0]).toBe(secondScope.resolve("dependency"));
                expect(second.values[0]).not.toBe(first.values[0]);

                for (let index = 1; index < 8; ++index)
                    expect(next.values[index]).not.toBe(first.values[index]);

            }
        );

        it
        (
            "preserves argument order, collections, and promise values",
            () =>
            {
                const promise = Promise.resolve(42);
                const scope = createSyncValueStrategyScope(new Map<string, unknown>([["collection", ["first", "second"]], ["promise", promise], ["value", 7]]));
                const keys: ("value" | "promise" | ["collection"])[] = ["value", ["collection"], "promise"];
                const instantiate = createRuntimeArgumentsFactoryStrategy<ReturnType<typeof collectArguments>>
                (
                    ...getTestRegistrationMaps(scope, keys),
                    { key: "target", type: DependencyDescriptorType.Factory, lifetime: DependencyLifetime.Singleton, factory: collectArguments, subDependenciesKeys: keys }
                );
                const result = instantiate(scope);

                expect(result.values).toEqual([7, scope.resolve(["collection"]), promise]);
                expect(result.values[2]).toBe(promise);
            }
        );

        it
        (
            "supports no dependencies",
            () =>
            {
                const scope = createDefaultDiScope();
                const instantiate = createRuntimeArgumentsFactoryStrategy
                (
                    ...getTestRegistrationMaps(createDefaultDiScope<RegisteredDependencies>(), []),
                    { key: "target", type: DependencyDescriptorType.Factory, lifetime: DependencyLifetime.Singleton, factory: collectArguments, subDependenciesKeys: [] }
                );

                expect(instantiate(scope).values).toEqual([]);
            }
        );

        it
        (
            "keeps arbitrary keys out of generated source",
            () =>
            {
                const key = "quote'\"; special-key";
                const scope = createSyncValueStrategyScope(new Map([[key, 42]]));
                const instantiate = createRuntimeArgumentsFactoryStrategy
                (
                    ...getTestRegistrationMaps(scope, [key]),
                    { key: "target", type: DependencyDescriptorType.Factory, lifetime: DependencyLifetime.Singleton, factory: collectArguments, subDependenciesKeys: [key] }
                );

                expect(instantiate(scope).values).toEqual([42]);
            }
        );

        it
        (
            "propagates factory errors",
            () =>
            {
                const error = new Error("Factory failed");
                const factory = () =>
                {
                    throw error;
                };
                const instantiate = createRuntimeArgumentsFactoryStrategy
                (
                    ...getTestRegistrationMaps(createDefaultDiScope<RegisteredDependencies>(), []),
                    { key: "target", type: DependencyDescriptorType.Factory, lifetime: DependencyLifetime.Singleton, factory: factory, subDependenciesKeys: [] }
                );
                const scope = createDefaultDiScope();

                expect(() => instantiate(scope)).toThrow(error);
            }
        );
    }
);

