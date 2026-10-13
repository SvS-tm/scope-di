import { DependencyDescriptorType, DependencyLifetime } from "../../../../../../../types";
import { getTestRegistrationMaps } from "../../../../../compilation/compilation.test-helpers";
import { describe, expect, it } from "@jest/globals";
import { createSyncStrategyChildScope, createSyncStrategyScope } from "../../../sync-strategy.test-helpers";
import { createFourArgumentsFactoryStrategy } from "./four-arguments-factory-strategy";

function collectArguments(...values: unknown[])
{
    return { values };
}

describe
(
    "createFourArgumentsFactoryStrategy",
    () =>
    {
        it
        (
            "resolves 4 arguments through the supplied scope on every construction",
            () =>
            {
                const root = createSyncStrategyScope();
                const firstScope = createSyncStrategyChildScope(root);
                const secondScope = createSyncStrategyChildScope(root);
                const keys = Array.from({ length: 4 }, (_, index) => index === 0 ? "dependency" : "transient");
                const instantiate = createFourArgumentsFactoryStrategy<ReturnType<typeof collectArguments>>
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

                expect(first.values).toHaveLength(4);
                expect(next.values).toHaveLength(4);
                expect(second.values).toHaveLength(4);
                expect(first).not.toBe(next);
                expect(first.values[0]).toBe(firstScope.resolve("dependency"));
                expect(next.values[0]).toBe(first.values[0]);
                expect(second.values[0]).toBe(secondScope.resolve("dependency"));
                expect(second.values[0]).not.toBe(first.values[0]);

                for (let index = 1; index < 4; ++index)
                    expect(next.values[index]).not.toBe(first.values[index]);

            }
        );
    }
);

