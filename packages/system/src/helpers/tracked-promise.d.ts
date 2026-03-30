export declare enum TrackedPromiseStatus {
    Pending = 0,
    Success = 1,
    Error = 2
}
export type TrackedSuceededPromise<T_Result> = (Promise<T_Result> & {
    readonly [TrackedPromise.status]: TrackedPromiseStatus.Success;
    readonly [TrackedPromise.value]: T_Result;
});
export type TrackedPendingPromise<T_Result> = (Promise<T_Result> & {
    readonly [TrackedPromise.status]: TrackedPromiseStatus.Pending;
});
export type TrackedErrorPromise<T_Result> = (Promise<T_Result> & {
    readonly [TrackedPromise.status]: TrackedPromiseStatus.Error;
    readonly [TrackedPromise.value]: unknown;
});
/**
 * {@link Promise} wrapper, that has additional properties {@link value} and {@link trackedPromiseStatus}
 * that you can use to read result and status of current promise in synchronous manner
 */
export type TrackedPromise<T_Result> = (TrackedSuceededPromise<T_Result> | TrackedErrorPromise<T_Result> | TrackedPendingPromise<T_Result>);
/**
 * This is {@link TrackedPromise} that can be manually controlled (resolved, rejected)
 */
export type ControlledTrackedPromise<T_Result> = (TrackedPromise<T_Result> & {
    [TrackedPromise.resolve](result: T_Result): void;
    [TrackedPromise.reject](reason: any): void;
});
export declare namespace TrackedPromise {
    const value: unique symbol;
    const status: unique symbol;
    const resolve: unique symbol;
    const reject: unique symbol;
    const isTracked: (value: unknown) => value is TrackedPromise<unknown>;
    /**
     *
     * @param promise promise to track
     * @returns read details at {@link TrackedPromise}
     */
    const track: <T_Result>(promise: Promise<T_Result>) => TrackedPromise<T_Result>;
    /**
     * Creates tracked promise in resolved state, useful when you need already resolved promise
     * without additional callbacks
     * @returns read details at {@link TrackedPromise}
     */
    const resolved: <T_Result>(result: T_Result) => TrackedSuceededPromise<T_Result>;
    /**
     * Creates promise that yoou can manually resolve or reject.
     * (after creation it will be in {@link TrackedPromiseStatus.Pending} state)
     * @returns
     */
    const controlled: <T_Result>() => ControlledTrackedPromise<T_Result>;
}
