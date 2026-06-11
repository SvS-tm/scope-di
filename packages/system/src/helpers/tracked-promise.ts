import { isSafeReference } from "../guards";
import type { Patch } from "../types/patch";

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
        readonly [TrackedPromise.status]: TrackedPromiseStatus.Success;
        readonly [TrackedPromise.value]: T_Result;
    }
);

export type TrackedPendingPromise<T_Result> = 
(
    Promise<T_Result>
        &
    {
        readonly [TrackedPromise.status]: TrackedPromiseStatus.Pending;
    }
);

export type TrackedErrorPromise<T_Result> =
(
    Promise<T_Result>
        &
    {
        readonly [TrackedPromise.status]: TrackedPromiseStatus.Error;
        readonly [TrackedPromise.value]: unknown;
    }
);

/**
 * {@link Promise} wrapper, that has additional properties {@link value} and {@link trackedPromiseStatus}
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

/**
 * This is {@link TrackedPromise} that can be manually controlled (resolved, rejected)
 */
export type ControlledTrackedPromise<T_Result> = 
(
    TrackedPromise<T_Result>
        &
    {
        [TrackedPromise.resolve](result: T_Result): void;
        [TrackedPromise.reject](reason: any): void;
    }
);

type PromiseWithResolvers<T_Result> = ReturnType<typeof Promise.withResolvers<T_Result>>;
type PromiseRejectAction<T_Result> = PromiseWithResolvers<T_Result>["reject"];
type PromiseResolveAction<T_Result> = PromiseWithResolvers<T_Result>["resolve"];
type PromiseConstructorWithOptionalResolvers = 
(
    Omit<PromiseConstructor, "withResolvers">
        &
    {
        withResolvers?: typeof Promise.withResolvers;
    }
);

const createPromiseWithResolvers = <T_Result>(): PromiseWithResolvers<T_Result> =>
{
    const promiseConstructor = Promise as PromiseConstructorWithOptionalResolvers;
    
    if (isSafeReference(promiseConstructor.withResolvers))
        return promiseConstructor.withResolvers();

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

export namespace TrackedPromise
{
    export const value: unique symbol = Symbol("Field where promise result is held");
    export const status: unique symbol = Symbol("Field where promise status is held");
    export const resolve: unique symbol = Symbol("Method that resolves controlled promise");
    export const reject: unique symbol = Symbol("Method that rejects controlled promise");

    export const isTracked = (value: unknown): value is TrackedPromise<unknown> =>
    {
        return isSafeReference(value) && Object.prototype.hasOwnProperty.call(value, status);
    };

    /**
     * 
     * @param promise promise to track
     * @returns read details at {@link TrackedPromise}
     */
    export const track = <T_Result>(promise: Promise<T_Result>): TrackedPromise<T_Result> =>
    {
        if (isTracked(promise))
            return promise as TrackedPromise<T_Result>;

        const patch = promise as Patch<TrackedPromise<T_Result>>;

        patch[status] = TrackedPromiseStatus.Pending;

        patch
            .then
            (
                (result) => 
                {
                    const suceeded = patch as Patch<TrackedSuceededPromise<T_Result>>;

                    suceeded[status] = TrackedPromiseStatus.Success;
                    suceeded[value] = result;
                }
            )
            .catch
            (
                (error) =>
                {
                    const failed = patch as Patch<TrackedErrorPromise<T_Result>>;

                    failed[status] = TrackedPromiseStatus.Error;
                    failed[value] = error;
                }
            );

        return patch;
    };

    /**
     * Creates tracked promise in resolved state, useful when you need already resolved promise 
     * without additional callbacks
     * @returns read details at {@link TrackedPromise}
     */
    export const resolved = <T_Result>(result: T_Result): TrackedSuceededPromise<T_Result> =>
    {
        const promise = Promise.resolve(result);

        const patch = promise as Patch<TrackedSuceededPromise<T_Result>>;

        patch[status] = TrackedPromiseStatus.Success;
        patch[value] = result;

        return patch;
    };

    /**
     * Creates promise that yoou can manually resolve or reject.
     * (after creation it will be in {@link TrackedPromiseStatus.Pending} state)
     * @returns 
     */
    export const controlled = <T_Result>() =>
    {
        const { promise, reject, resolve } = createPromiseWithResolvers<T_Result>();
        
        const trackedPromise = track(promise);

        const patch = trackedPromise as ControlledTrackedPromise<T_Result>;

        patch[TrackedPromise.resolve] = resolve;
        patch[TrackedPromise.reject] = reject;

        return patch;
    };
}
