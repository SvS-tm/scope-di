import { DependencyDescriptorType, DependencyLifetime } from "../../../../../../../types";
import { getTestRegistrationMaps } from "../../../../../compilation/compilation.test-helpers";
import { describe, expect, it } from "@jest/globals";
import { createSyncStrategyChildScope, createSyncStrategyScope } from "../../../sync-strategy.test-helpers";
import { createOneArgumentFactoryStrategy } from "./one-argument-factory-strategy";

function collectArguments(...values: unknown[])
{
    return { values };
}

describe
(
    "createOneArgumentFactoryStrategy",
    () =>
    {
        it
        (
            "resolves 1 arguments through the supplied scope on every construction",
            () =>
            {
                const root = createSyncStrategyScope();
                const firstScope = createSyncStrategyChildScope(root);
                const secondScope = createSyncStrategyChildScope(root);
                const keys = Array.from({ length: 1 }, (_, index) => index === 0 ? "dependency" : "transient");
                const instantiate = createOneArgumentFactoryStrategy<ReturnType<typeof collectArguments>>
                (
                    ...getTestRegistrationMaps(root, keys),
                    {
                        key: "target",
                        type: DependencyDescriptorType.Factory,
                        lifetime: DependencyLifetime.Singleton,
                        factory: collectArguments,
                        subDependenciesKeys: keys
                    }
                );

                const first: ReturnType<typeof collectArguments> = instantiate(firstScope);
                const next: ReturnType<typeof collectArguments> = instantiate(firstScope);
                const second: ReturnType<typeof collectArguments> = instantiate(secondScope);

                expect(first.values).toHaveLength(1);
                expect(next.values).toHaveLength(1);
                expect(second.values).toHaveLength(1);
                expect(first).not.toBe(next);
                expect(first.values[0]).toBe(firstScope.resolve("dependency"));
                expect(next.values[0]).toBe(first.values[0]);
                expect(second.values[0]).toBe(secondScope.resolve("dependency"));
                expect(second.values[0]).not.toBe(first.values[0]);

            }
        );
    }
);

