import { describe, it, expect } from "@jest/globals";
import { isNotSafeReference } from "./is-not-safe-reference";

describe
(
    "is-not-safe-reference",
    () =>
    {
        it
        (
            "Returns true for undefined",
            () =>
            {
                const result = isNotSafeReference(undefined);

                expect(result).toBe(true);
            }
        );

        it
        (
            "Returns true for null",
            () =>
            {
                const result = isNotSafeReference(null);

                expect(result).toBe(true);
            }
        );

        it
        (
            "Returns false for non-falsy value",
            () =>
            {
                const result = isNotSafeReference(1);

                expect(result).toBe(false);
            }
        );

        it
        (
            "Returns false for falsy value",
            () =>
            {
                const result = isNotSafeReference("");

                expect(result).toBe(false);
            }
        );
    }
);