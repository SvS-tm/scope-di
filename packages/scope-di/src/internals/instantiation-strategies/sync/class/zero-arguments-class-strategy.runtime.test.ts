import { describe, expect, it } from "@jest/globals";
import { createDefaultDiScope } from "../../../scope/default-di-scope.test-helpers";
import { createZeroArgumentsClassStrategy } from "./zero-arguments-class-strategy";

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
    "createZeroArgumentsClassStrategy",
    () =>
    {
        it
        (
            "constructs a new result without dependencies on every invocation",
            () =>
            {
                const scope = createDefaultDiScope();
                const instantiate = createZeroArgumentsClassStrategy(ArgumentList);
                const first: ArgumentList = instantiate(scope);
                const second: ArgumentList = instantiate(scope);

                expect(first.values).toEqual([]);
                expect(second.values).toEqual([]);
                expect(first).not.toBe(second);
            }
        );
    }
);

