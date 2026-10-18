import { DependencyDescriptorType, DependencyLifetime } from "../../../../../../../types";
import { getTestRegistrationMaps } from "../../../../../compilation/compilation.test-helpers";
import { describe, expect, it } from "@jest/globals";
import { createSyncStrategyChildScope, createSyncStrategyScope, createSyncValueStrategyScope } from "../../../sync-strategy.test-helpers";
import { createSpreadArgumentsClassStrategy } from "./spread-arguments-class-strategy";

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
    "createSpreadArgumentsClassStrategy",
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
                const instantiate = createSpreadArgumentsClassStrategy<InstanceType<typeof ArgumentList>>
                (
                    ...getTestRegistrationMaps(root, keys),
                    {
                        key: "target",
                        type: DependencyDescriptorType.Class,
                        lifetime: DependencyLifetime.Singleton,
                        constructor: ArgumentList,
                        subDependenciesKeys: keys
                    }
                );

                const first: ArgumentList = instantiate(firstScope);
                const next: ArgumentList = instantiate(firstScope);
                const second: ArgumentList = instantiate(secondScope);

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
                const instantiate = createSpreadArgumentsClassStrategy<InstanceType<typeof ArgumentList>>
                (
                    ...getTestRegistrationMaps(scope, keys),
                    {
                        key: "target",
                        type: DependencyDescriptorType.Class,
                        lifetime: DependencyLifetime.Singleton,
                        constructor: ArgumentList,
                        subDependenciesKeys: keys
                    }
                );
                const result = instantiate(scope);

                expect(result.values).toEqual([7, scope.resolve(["collection"]), promise]);
                expect(result.values[2]).toBe(promise);
            }
        );
    }
);

