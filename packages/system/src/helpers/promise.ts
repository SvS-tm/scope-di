import { isNotSafeReference } from "../guards";
import { Patch } from "../types/patch";

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
    return value instanceof Promise && trackedPromiseStatus in value;
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

type InferConstructor<T_Constructor> = T_Constructor extends new (...args: infer T_Args) => infer T_Result
    ? (...args: T_Args) => T_Result
    : never;

type PromiseInitializationFunction<T_Result> = Parameters<InferConstructor<typeof Promise<T_Result>>>[0];
type PromiseActions<T_Result> = Parameters<PromiseInitializationFunction<T_Result>>;

export const createControlledTrackedPromise = <T_Result>() =>
{
    let actions: PromiseActions<T_Result> | undefined = undefined;

    const promise = trackPromise
    (
        new Promise<T_Result>
        (
            (nativeResolve, nativeReject) => 
                void (actions = [nativeResolve, nativeReject])
        )
    );

    if (isNotSafeReference(actions))
        throw new Error("Failed to patch promise!");

    const [ nativeResolve, nativeReject ] = actions as PromiseActions<T_Result>;

    const patch = promise as ControlledTrackedPromise<T_Result>;

    patch[resolveTrackedPromise] = nativeResolve;
    patch[rejectTrackedPromise] = nativeReject;

    return patch;
};
