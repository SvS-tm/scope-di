import { ReactNode } from "react";
import { suspendedAwait } from "../helpers/promise";

export type DiAwaitProps<T_Value> = 
{
    promise: Promise<T_Value>;
    children: (awaited: T_Value) => ReactNode;
};

export const DiAwait = <T_Value extends unknown>({ promise, children }: DiAwaitProps<T_Value>) =>
{
    const result = suspendedAwait(promise);

    return children(result);
};
