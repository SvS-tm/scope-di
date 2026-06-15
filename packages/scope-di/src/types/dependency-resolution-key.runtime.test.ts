import { describe, expect, it } from "@jest/globals";
import { DependencyResolutionKey } from "./dependency-resolution-key";

describe
(
    "DependencyResolutionKey",
    () =>
    {
        it
        (
            "equal compares singular and collection keys by their resolution semantics",
            () =>
            {
                expect(DependencyResolutionKey.equal("key", "key")).toBe(true);
                expect(DependencyResolutionKey.equal("key", "other")).toBe(false);
                expect(DependencyResolutionKey.equal(["key"], ["key"])).toBe(true);
                expect(DependencyResolutionKey.equal(["key"], ["other"])).toBe(false);
                expect(DependencyResolutionKey.equal("key", ["key"])).toBe(false);
                expect(DependencyResolutionKey.equal(["key"], "key")).toBe(false);
            }
        );

        it
        (
            "equalRange compares resolution key lists item by item",
            () =>
            {
                expect(DependencyResolutionKey.equalRange(["a", ["b"]], ["a", ["b"]])).toBe(true);
                expect(DependencyResolutionKey.equalRange(["a"], ["a", "b"])).toBe(false);
                expect(DependencyResolutionKey.equalRange(["a", ["b"]], ["a", ["c"]])).toBe(false);
            }
        );
    }
);
