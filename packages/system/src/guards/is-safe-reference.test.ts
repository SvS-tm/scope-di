import { describe, it, expect } from "@jest/globals";
import { isSafeReference } from "./is-safe-reference";

describe
(
    "is-not-safe-reference",
    () =>
    {
        it
        (
            "Returns false for undefined",
            () =>
            {
                const result = isSafeReference(undefined);

                expect(result).toBe(false);
            }
        );

        it
        (
            "Returns false for null",
            () =>
            {
                const result = isSafeReference(null);

                expect(result).toBe(false);
            }
        );

        it
        (
            "Returns true for non-falsy value",
            () =>
            {
                const result = isSafeReference(1);

                expect(result).toBe(true);
            }
        );

        it
        (
            "Returns true for falsy value",
            () =>
            {
                const result = isSafeReference("");

                expect(result).toBe(true);
            }
        );
    }
);
