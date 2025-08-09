import { describe, expect, it } from "@jest/globals";
import { throwError } from "./throw-error";

describe
(
    "throw-error", 
    () =>
    {
        it
        (
            "Throws passed error",
            () =>
            {
                const error = new Error();

                expect(() => throwError(error)).toThrow(error);
            }
        )
    }
);