import { DependencyDescriptorType, DependencyLifetime } from "../../../../types";
import { describe, expect, it } from "@jest/globals";
import { createDefaultDiScope } from "../../../scope/default-di-scope.test-helpers";
import { createZeroArgumentsFactoryStrategy } from "./zero-arguments-factory-strategy";

function collectArguments(...values: unknown[])
{
    return { values };
}

describe
(
    "createZeroArgumentsFactoryStrategy",
    () =>
    {
        it
        (
            "constructs a new result without dependencies on every invocation",
            () =>
            {
                const scope = createDefaultDiScope();
                const instantiate = createZeroArgumentsFactoryStrategy
                (
                    {
                        key: "target",
                        type: DependencyDescriptorType.Factory,
                        lifetime: DependencyLifetime.Singleton,
                        factory: collectArguments
                    }
                );
                const first: ReturnType<typeof collectArguments> = instantiate(scope);
                const second: ReturnType<typeof collectArguments> = instantiate(scope);

                expect(first.values).toEqual([]);
                expect(second.values).toEqual([]);
                expect(first).not.toBe(second);
            }
        );
    }
);

