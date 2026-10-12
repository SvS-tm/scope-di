import { getTestRegistrationMaps } from "../../compilation.test-helpers";
import { describe, expect, it } from "@jest/globals";
import { createSyncStrategyChildScope, createSyncStrategyScope, createSyncValueStrategyScope } from "../sync-strategy.test-helpers";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { createThreeArgumentsClassStrategy } from "./three-arguments-class-strategy";

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
    "createThreeArgumentsClassStrategy",
    () =>
    {
        it
        (
            "resolves 3 arguments through the supplied scope on every construction",
            () =>
            {
                const root = createSyncStrategyScope();
                const firstScope = createSyncStrategyChildScope(root);
                const secondScope = createSyncStrategyChildScope(root);
                const keys = Array.from({ length: 3 }, (_, index) => index === 0 ? "dependency" : "transient");
                const instantiate = createThreeArgumentsClassStrategy<RegisteredDependencies, typeof ArgumentList>
                (
                    ...getTestRegistrationMaps(root, keys),
                    ArgumentList,
                    keys
                );

                const first: ArgumentList = instantiate(firstScope);
                const next: ArgumentList = instantiate(firstScope);
                const second: ArgumentList = instantiate(secondScope);

                expect(first.values).toHaveLength(3);
                expect(next.values).toHaveLength(3);
                expect(second.values).toHaveLength(3);
                expect(first).not.toBe(next);
                expect(first.values[0]).toBe(firstScope.resolve("dependency"));
                expect(next.values[0]).toBe(first.values[0]);
                expect(second.values[0]).toBe(secondScope.resolve("dependency"));
                expect(second.values[0]).not.toBe(first.values[0]);

                for (let index = 1; index < 3; ++index)
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
                const instantiate = createThreeArgumentsClassStrategy<RegisteredDependencies, typeof ArgumentList>
                (
                    ...getTestRegistrationMaps(scope, keys),
                    ArgumentList,
                    keys
                );
                const result = instantiate(scope);

                expect(result.values).toEqual([7, scope.resolve(["collection"]), promise]);
                expect(result.values[2]).toBe(promise);
            }
        );
    }
);

