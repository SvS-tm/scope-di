import { describe, expect, it } from "@jest/globals";
import { TrackedPromise, TrackedPromiseStatus, type TrackedErrorPromise, type TrackedSuceededPromise } from "./tracked-promise";

describe
(
    "tracked-promise",
    () =>
    {
        it
        (
            "isTracked returns false for non-tracked values",
            () =>
            {
                expect(TrackedPromise.isTracked(null)).toBe(false);
                expect(TrackedPromise.isTracked(undefined)).toBe(false);
                expect(TrackedPromise.isTracked({})).toBe(false);
                expect(TrackedPromise.isTracked(Promise.resolve())).toBe(false);
            }
        );

        it
        (
            "resolved creates an already successful tracked promise",
            async () =>
            {
                const value = {};
                const promise = TrackedPromise.resolved(value);

                expect(TrackedPromise.isTracked(promise)).toBe(true);
                expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Success);
                expect(promise[TrackedPromise.value]).toBe(value);
                await expect(promise).resolves.toBe(value);
            }
        );

        it
        (
            "resolved preserves falsy values in the synchronous value slot",
            async () =>
            {
                const values = [undefined, null, false, 0, ""];

                for (const value of values)
                {
                    const promise = TrackedPromise.resolved(value);

                    expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Success);
                    expect(promise[TrackedPromise.value]).toBe(value);
                    await expect(promise).resolves.toBe(value);
                }
            }
        );

        it
        (
            "track marks a native promise as pending before it resolves",
            async () =>
            {
                let resolve!: (value: string) => void;
                const nativePromise = new Promise<string>((nativeResolve) => void (resolve = nativeResolve));
                const promise = TrackedPromise.track(nativePromise);

                expect(TrackedPromise.isTracked(promise)).toBe(true);
                expect(promise).toBe(nativePromise);
                expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Pending);

                resolve("resolved");

                await expect(promise).resolves.toBe("resolved");
                expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Success);
                expect((promise as TrackedSuceededPromise<string>)[TrackedPromise.value]).toBe("resolved");
            }
        );

        it
        (
            "track stores rejection details when a native promise rejects",
            async () =>
            {
                let reject!: (error: unknown) => void;
                const error = new Error("rejected");
                const nativePromise = new Promise<string>((_, nativeReject) => void (reject = nativeReject));
                const promise = TrackedPromise.track(nativePromise);

                reject(error);

                await expect(promise).rejects.toBe(error);
                expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Error);
                expect((promise as TrackedErrorPromise<string>)[TrackedPromise.value]).toBe(error);
            }
        );

        it
        (
            "track returns an already tracked promise unchanged",
            () =>
            {
                const promise = TrackedPromise.controlled<string>();
                const trackedAgain = TrackedPromise.track(promise);

                expect(trackedAgain).toBe(promise);
                expect(trackedAgain[TrackedPromise.status]).toBe(TrackedPromiseStatus.Pending);
            }
        );

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
            "controlled works when Promise.withResolvers is unavailable",
            async () =>
            {
                const promiseConstructor = Promise as Omit<PromiseConstructor, "withResolvers"> & { withResolvers?: typeof Promise.withResolvers | undefined; };
                const originalWithResolvers = promiseConstructor.withResolvers;

                try
                {
                    delete promiseConstructor.withResolvers;

                    const promise = TrackedPromise.controlled<string>();

                    expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Pending);

                    promise[TrackedPromise.resolve]("resolved");

                    await expect(promise).resolves.toBe("resolved");
                    expect(promise[TrackedPromise.status]).toBe(TrackedPromiseStatus.Success);
                    expect((promise as TrackedSuceededPromise<string>)[TrackedPromise.value]).toBe("resolved");
                }
                finally
                {
                    Object.defineProperty
                    (
                        promiseConstructor,
                        "withResolvers",
                        {
                            configurable: true,
                            writable: true,
                            value: originalWithResolvers
                        }
                    );
                }
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
