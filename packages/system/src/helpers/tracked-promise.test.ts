import { describe, expect, it } from "@jest/globals";
import { TrackedPromise, TrackedPromiseStatus, type TrackedErrorPromise, type TrackedSuceededPromise } from "./tracked-promise";

describe
(
    "tracked-promise",
    () =>
    {
        it
        (
            "controlled creates a pending tracked promise that can be resolved manually",
            async () =>
            {
                const promise = TrackedPromise.controlled<string>();

                expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Pending);

                promise[TrackedPromise.resolve]("resolved");

                await expect(promise).resolves.toBe("resolved");
                expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Success);
                expect((promise as TrackedSuceededPromise<string>)[TrackedPromise.value]).toBe("resolved");
            }
        );

        it
        (
            "controlled creates a pending tracked promise that can be rejected manually",
            async () =>
            {
                const error = new Error("rejected");
                const promise = TrackedPromise.controlled<string>();

                expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Pending);

                promise[TrackedPromise.reject](error);

                await expect(promise).rejects.toBe(error);
                expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Error);
                expect((promise as TrackedErrorPromise<string>)[TrackedPromise.value]).toBe(error);
            }
        );
    }
);
