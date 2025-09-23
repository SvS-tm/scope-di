import { isSafeReference } from "../guards";
import type { Patch } from "../types/patch";

export const trackedPromiseValue: unique symbol = Symbol("Field where promise result is held");
export const trackedPromiseStatus: unique symbol = Symbol("Field where promise status is held");

export enum TrackedPromiseStatus
{
    Pending,
    Success,
    Error
}

export type TrackedSuceededPromise<T_Result> = 
(
    Promise<T_Result>
        &
    {
        readonly [trackedPromiseStatus]: TrackedPromiseStatus.Success;
        readonly [trackedPromiseValue]: T_Result;
    }
);

export type TrackedPendingPromise<T_Result> = 
(
    Promise<T_Result>
        &
    {
        readonly [trackedPromiseStatus]: TrackedPromiseStatus.Pending;
    }
);

export type TrackedErrorPromise<T_Result> =
(
    Promise<T_Result>
        &
    {
        readonly [trackedPromiseStatus]: TrackedPromiseStatus.Error;
        readonly [trackedPromiseValue]: unknown;
    }
);

/**
 * {@link Promise} wrapper, that has additional properties {@link trackedPromiseValue} and {@link trackedPromiseStatus}
 * that you can use to read result and status of current promise in synchronous manner
 */
export type TrackedPromise<T_Result> = 
(
    TrackedSuceededPromise<T_Result>
        |
    TrackedErrorPromise<T_Result>
        |
    TrackedPendingPromise<T_Result>
);

export const isTrackedPromise = (value: unknown): value is TrackedPromise<unknown> =>
{
    return !!value && Object.prototype.hasOwnProperty.call(value, trackedPromiseStatus);
};

/**
 * 
 * @param promise promise to track
 * @returns read details at {@link TrackedPromise}
 */
export const trackPromise = <T_Result>(promise: Promise<T_Result>): TrackedPromise<T_Result> =>
{
    if (isTrackedPromise(promise))
        return promise as TrackedPromise<T_Result>;

    const patch = promise as Patch<TrackedPromise<T_Result>>;

    patch[trackedPromiseStatus] = TrackedPromiseStatus.Pending;

    patch
        .then
        (
            (result) => 
            {
                const suceeded = patch as Patch<TrackedSuceededPromise<T_Result>>;

                suceeded[trackedPromiseStatus] = TrackedPromiseStatus.Success;
                suceeded[trackedPromiseValue] = result;
            }
        )
        .catch
        (
            (error) =>
            {
                const failed = patch as Patch<TrackedErrorPromise<T_Result>>;

                failed[trackedPromiseStatus] = TrackedPromiseStatus.Error;
                failed[trackedPromiseValue] = error;
            }
        );

    return patch;
};

/**
 * Tracks resolved promise, useful when you need already resolved promise 
 * without additional callbacks
 * @returns read details at {@link TrackedPromise}
 */
export const trackResolvedPromise = <T_Result>(result: T_Result): TrackedSuceededPromise<T_Result> =>
{
    const promise = Promise.resolve(result);

    const patch = promise as Patch<TrackedSuceededPromise<T_Result>>;

    patch[trackedPromiseStatus] = TrackedPromiseStatus.Success;
    patch[trackedPromiseValue] = result;

    return patch;
};

export const resolveTrackedPromise: unique symbol = Symbol("Method that resolves controlled promise");
export const rejectTrackedPromise: unique symbol = Symbol("Method that rejects controlled promise");

/**
 * This is {@link TrackedPromise} that can be manually controlled (resolved, rejected)
 */
export type ControlledTrackedPromise<T_Result> = 
(
    TrackedPromise<T_Result>
        &
    {
        [resolveTrackedPromise](result: T_Result): void;
        [rejectTrackedPromise](reason: any): void;
    }
);

type PromiseWithResolvers<T_Result> = ReturnType<typeof Promise.withResolvers<T_Result>>;
type PromiseRejectAction<T_Result> = PromiseWithResolvers<T_Result>["reject"];
type PromiseResolveAction<T_Result> = PromiseWithResolvers<T_Result>["resolve"];

const createPromiseWithResolvers = <T_Result>(): PromiseWithResolvers<T_Result> =>
{
    const withResolvers: typeof Promise.withResolvers | undefined = Promise.withResolvers as any;

    if (withResolvers)
        return withResolvers();

    let resolve: PromiseResolveAction<T_Result> | null = null;
    let reject: PromiseRejectAction<T_Result> | null = null;

    const promise = new Promise<T_Result>
    (
        (nativeResolve, nativeReject) => 
        {
            resolve = nativeResolve;
            reject = nativeReject;
        }
    );

    if (!isSafeReference(resolve) || !isSafeReference(reject))
        throw new Error("Failed to patch promise!");

    return { promise, resolve, reject };
};

export const createControlledTrackedPromise = <T_Result>() =>
{
    const { promise, reject, resolve } = createPromiseWithResolvers<T_Result>();
    
    const trackedPromise = trackPromise(promise);

    const patch = trackedPromise as ControlledTrackedPromise<T_Result>;

    patch[resolveTrackedPromise] = resolve;
    patch[rejectTrackedPromise] = reject;

    return patch;
};
