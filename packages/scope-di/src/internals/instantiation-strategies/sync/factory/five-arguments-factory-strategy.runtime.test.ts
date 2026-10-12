import { getTestRegistrationMaps } from "../../compilation.test-helpers";
import { describe, expect, it } from "@jest/globals";
import { createSyncStrategyChildScope, createSyncStrategyScope } from "../sync-strategy.test-helpers";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { createFiveArgumentsFactoryStrategy } from "./five-arguments-factory-strategy";

function collectArguments(...values: unknown[])
{
    return { values };
}

describe
(
    "createFiveArgumentsFactoryStrategy",
    () =>
    {
        it
        (
            "resolves 5 arguments through the supplied scope on every construction",
            () =>
            {
                const root = createSyncStrategyScope();
                const firstScope = createSyncStrategyChildScope(root);
                const secondScope = createSyncStrategyChildScope(root);
                const keys = Array.from({ length: 5 }, (_, index) => index === 0 ? "dependency" : "transient");
                const instantiate = createFiveArgumentsFactoryStrategy<RegisteredDependencies, typeof collectArguments>
                (
                    ...getTestRegistrationMaps(root, keys),
                    collectArguments,
                    keys
                );

                const first: ReturnType<typeof collectArguments> = instantiate(firstScope);
                const next: ReturnType<typeof collectArguments> = instantiate(firstScope);
                const second: ReturnType<typeof collectArguments> = instantiate(secondScope);

                expect(first.values).toHaveLength(5);
                expect(next.values).toHaveLength(5);
                expect(second.values).toHaveLength(5);
                expect(first).not.toBe(next);
                expect(first.values[0]).toBe(firstScope.resolve("dependency"));
                expect(next.values[0]).toBe(first.values[0]);
                expect(second.values[0]).toBe(secondScope.resolve("dependency"));
                expect(second.values[0]).not.toBe(first.values[0]);

                for (let index = 1; index < 5; ++index)
                    expect(next.values[index]).not.toBe(first.values[index]);

            }
        );
    }
);

