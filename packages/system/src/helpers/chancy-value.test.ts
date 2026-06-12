import { describe, expect, it } from "@jest/globals";
import { ChancyValue } from "./chancy-value";

describe
(
    "ChancyValue",
    () =>
    {
        it
        (
            "success creates a successful value for truthy and falsy values",
            () =>
            {
                const values = [undefined, null, false, 0, "", "value", {}];

                for (const value of values)
                {
                    const chancyValue = ChancyValue.success(value);

                    expect(ChancyValue.isSuccess(chancyValue)).toBe(true);

                    if (!ChancyValue.isSuccess(chancyValue))
                        throw new Error("Expected success value");

                    expect(ChancyValue.get(chancyValue)).toBe(value);
                }
            }
        );

        it
        (
            "failure creates a failed value",
            () =>
            {
                const chancyValue = ChancyValue.failure();

                expect(ChancyValue.isSuccess(chancyValue)).toBe(false);
            }
        );
    }
);
