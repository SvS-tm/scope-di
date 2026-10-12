import { getTestRegistrationMaps } from "../../compilation.test-helpers";
import { describe, expect, it } from "@jest/globals";
import { createSyncStrategyChildScope, createSyncStrategyScope } from "../sync-strategy.test-helpers";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { createTwoArgumentsClassStrategy } from "./two-arguments-class-strategy";

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
    "createTwoArgumentsClassStrategy",
    () =>
    {
        it
        (
            "resolves 2 arguments through the supplied scope on every construction",
            () =>
            {
                const root = createSyncStrategyScope();
                const firstScope = createSyncStrategyChildScope(root);
                const secondScope = createSyncStrategyChildScope(root);
                const keys = Array.from({ length: 2 }, (_, index) => index === 0 ? "dependency" : "transient");
                const instantiate = createTwoArgumentsClassStrategy<RegisteredDependencies, typeof ArgumentList>
                (
                    ...getTestRegistrationMaps(root, keys),
                    ArgumentList,
                    keys
                );

                const first: ArgumentList = instantiate(firstScope);
                const next: ArgumentList = instantiate(firstScope);
                const second: ArgumentList = instantiate(secondScope);

                expect(first.values).toHaveLength(2);
                expect(next.values).toHaveLength(2);
                expect(second.values).toHaveLength(2);
                expect(first).not.toBe(next);
                expect(first.values[0]).toBe(firstScope.resolve("dependency"));
                expect(next.values[0]).toBe(first.values[0]);
                expect(second.values[0]).toBe(secondScope.resolve("dependency"));
                expect(second.values[0]).not.toBe(first.values[0]);

                for (let index = 1; index < 2; ++index)
                    expect(next.values[index]).not.toBe(first.values[index]);

            }
        );
    }
);

