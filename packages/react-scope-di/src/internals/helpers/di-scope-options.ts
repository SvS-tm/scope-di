import { isSafeReference } from "@svs-tm/system";
import { DiScopeOptions } from "../../types/di-scope-options";

export const fallbackDiScopeOptions = <T_DiScopeOptions extends DiScopeOptions>
(
    options: T_DiScopeOptions | undefined, 
    fallback: DiScopeOptions | undefined
) : T_DiScopeOptions | undefined =>
{
    if (!isSafeReference(options))
    {
        if (!isSafeReference(fallback))
            return undefined;
        else
            return { ...fallback } as T_DiScopeOptions;
    }
    else
    {
        return {
            ...options,
            error: options.error ?? fallback?.error,
            pending: options.pending ?? fallback?.pending
        };
    }
};
