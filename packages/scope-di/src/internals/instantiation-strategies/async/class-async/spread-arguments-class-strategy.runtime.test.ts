import { describe, expect, it, jest } from "@jest/globals";
import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { AsyncArgumentList, assertTrackedPromise, createAsyncStrategyScope } from "../async-strategy.test-helpers";
import { createSpreadArgumentsAsyncClassStrategy } from "./spread-arguments-class-strategy";

describe
(
    "createSpreadArgumentsAsyncClassStrategy",
    () =>
    {
        it
        (
            "preserves argument order and constructs anew through the supplied scope",
            async () =>
            {
                const values = Array.from({ length: 8 }, (_, index) => index);
                const firstScope = createAsyncStrategyScope(values);
                const secondScope = createAsyncStrategyScope(values.map(value => value + 100));
                const keys = firstScope.keys.slice().reverse();
                const instantiate = createSpreadArgumentsAsyncClassStrategy(AsyncArgumentList, keys);
                const first = instantiate(firstScope.scope);
                assertTrackedPromise(first);
                const second = instantiate(secondScope.scope);

                expect(TrackedPromise.isTracked(first)).toBe(true);
                expect(first[TrackedPromise.status]).toBe(TrackedPromiseStatus.Success);

                expect((await first).values).toEqual(values.slice().reverse());
                expect((await second).values).toEqual(values.map(value => value + 100).reverse());
                expect(await first).not.toBe(await instantiate(firstScope.scope));
            }
        );

        it
        (
            "waits for pending dependencies before construction and takes the settled path on reuse",
            async () =>
            {
                const values = Array.from({ length: 8 }, (_, index) => index);
                const dependency = TrackedPromise.controlled<number>();
                const { scope, keys } = createAsyncStrategyScope(values, new Map([[0, dependency]]));
                const instantiate = createSpreadArgumentsAsyncClassStrategy(AsyncArgumentList, keys);
                const first = instantiate(scope);
                assertTrackedPromise(first);

                expect(first[TrackedPromise.status]).toBe(TrackedPromiseStatus.Pending);
                dependency[TrackedPromise.resolve](42);

                expect((await first).values).toEqual([42, ...values.slice(1)]);

                const next = instantiate(scope);
                assertTrackedPromise(next);

                expect(next[TrackedPromise.status]).toBe(TrackedPromiseStatus.Success);
                expect((await next).values).toEqual([42, ...values.slice(1)]);
            }
        );

        it
        (
            "propagates dependency rejection without calling the constructor",
            async () =>
            {
                const dependency = TrackedPromise.controlled<number>();
                const { scope, keys } = createAsyncStrategyScope(new Array(8).fill(0), new Map([[0, dependency]]));
                const construct = jest.fn((..._values: unknown[]) => ({}));
                class Target
                {
                    public constructor(...values: unknown[])
                    {
                        construct(...values);
                    }
                }
                const instantiate = createSpreadArgumentsAsyncClassStrategy(Target, keys);
                const promise = instantiate(scope);
                assertTrackedPromise(promise);
                const error = new Error("Dependency failed");
                const rejection = expect(promise).rejects.toBe(error);

                dependency[TrackedPromise.reject](error);

                await rejection;
                expect(construct).not.toHaveBeenCalled();
            }
        );

        it
        (
            "passes promise-valued sync dependencies through unchanged",
            async () =>
            {
                const promiseValue = Promise.resolve(42);
                const { scope, keys } = createAsyncStrategyScope(new Array(8).fill(promiseValue));
                const instantiate = createSpreadArgumentsAsyncClassStrategy(AsyncArgumentList, keys);
                const result = await instantiate(scope);

                expect(result.values).toHaveLength(8);

                for (const value of result.values)
                    expect(value).toBe(promiseValue);
            }
        );

        it
        (
            "supports an empty dependency list",
            async () =>
            {
                const { scope } = createAsyncStrategyScope([]);
                const instantiate = createSpreadArgumentsAsyncClassStrategy(AsyncArgumentList, []);

                expect((await instantiate(scope)).values).toEqual([]);
            }
        );
    }
);

