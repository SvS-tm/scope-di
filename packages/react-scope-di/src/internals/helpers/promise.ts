import { TrackedPromise, TrackedPromiseStatus, isSafeReference } from "@svs-tm/system";
import React, { type Suspense } from "react";

/**
 * Suspens current component until promise is resolved.
 * 
 * @note **Use it in combination with {@link Suspense}**
 * @param promise Promise to await
 * @returns resolved result
 */
export const suspendedAwait = <T_Result>(promise: Promise<T_Result>): T_Result =>
{
    const use = React.use;

    /**
     * @note for React 19+ this is recommended way for suspending
     */
    if (isSafeReference(use))
        return use(promise);

    /**
     * @note otherwise - we fallback to our own internal implementation
     * (legacy throw promise approach)
     */
    const trackedPromise = TrackedPromise.track(promise);

    switch (trackedPromise[TrackedPromise.status])
    {
        case TrackedPromiseStatus.Pending:
            throw trackedPromise;
        case TrackedPromiseStatus.Error:
            throw trackedPromise[TrackedPromise.value];
        case TrackedPromiseStatus.Success:
            return trackedPromise[TrackedPromise.value];
    }
};
