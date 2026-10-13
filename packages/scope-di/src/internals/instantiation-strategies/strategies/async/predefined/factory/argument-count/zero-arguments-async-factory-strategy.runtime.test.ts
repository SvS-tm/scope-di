import { DependencyDescriptorType, DependencyLifetime } from "../../../../../../../types";
import { describe, expect, it } from "@jest/globals";
import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { collectAsyncArguments, assertTrackedPromise, createAsyncStrategyScope } from "../../../async-strategy.test-helpers";
import { createZeroArgumentsAsyncFactoryStrategy } from "./zero-arguments-async-factory-strategy";

describe
(
    "createZeroArgumentsAsyncFactoryStrategy",
    () =>
    {
        it
        (
            "returns tracked promises with a new result on every invocation",
            async () =>
            {
                const { scope } = createAsyncStrategyScope([]);
                const instantiate = createZeroArgumentsAsyncFactoryStrategy
                (
                    {
                        key: "target",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Singleton,
                        factory: collectAsyncArguments
                    }
                );
                const first = instantiate(scope);
                assertTrackedPromise(first);
                const second = instantiate(scope);

                expect(TrackedPromise.isTracked(first)).toBe(true);

                expect((await first).values).toEqual([]);
                expect((await second).values).toEqual([]);
                expect(await first).not.toBe(await second);
            }
        );

        it
        (
            "tracks the factory's own pending result and propagates rejection",
            async () =>
            {
                const { scope } = createAsyncStrategyScope([]);
                const result = TrackedPromise.controlled<number>();
                const instantiate = createZeroArgumentsAsyncFactoryStrategy
                (
                    {
                        key: "target",
                        type: DependencyDescriptorType.FactoryAsync,
                        lifetime: DependencyLifetime.Singleton,
                        factory: () => result
                    }
                );
                const promise = instantiate(scope);
                assertTrackedPromise(promise);
                const error = new Error("Factory failed");
                const rejection = expect(promise).rejects.toBe(error);

                expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Pending);
                result[TrackedPromise.reject](error);

                await rejection;
            }
        );
    }
);

