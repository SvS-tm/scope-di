import type { DiAwaitProps } from "../../types/di-await-component";
import { suspendedAwait } from "../helpers/promise";

export const DiAwait = <T_Value extends unknown>({ promise, children }: DiAwaitProps<T_Value>) =>
{
    const result = suspendedAwait(promise);

    return <>{children(result)}</>;
};
