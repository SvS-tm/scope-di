import { describe, expect, it } from "@jest/globals";
import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { AsyncArgumentList, assertTrackedPromise, createAsyncStrategyScope } from "../async-strategy.test-helpers";
import { createZeroArgumentsAsyncClassStrategy } from "./zero-arguments-async-class-strategy";

describe
(
    "createZeroArgumentsAsyncClassStrategy",
    () =>
    {
        it
        (
            "returns tracked promises with a new result on every invocation",
            async () =>
            {
                const { scope } = createAsyncStrategyScope([]);
                const instantiate = createZeroArgumentsAsyncClassStrategy(AsyncArgumentList);
                const first = instantiate(scope);
                assertTrackedPromise(first);
                const second = instantiate(scope);

                expect(TrackedPromise.isTracked(first)).toBe(true);
                expect(first[TrackedPromise.status]).toBe(TrackedPromiseStatus.Success);

                expect((await first).values).toEqual([]);
                expect((await second).values).toEqual([]);
                expect(await first).not.toBe(await second);
            }
        );
    }
);

