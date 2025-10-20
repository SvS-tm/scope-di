import { isSafeReference } from "@svs-tm/system";
import { DiResolutionOptions } from "../../types/di-resolution-options";

export const fallbackDiScopeOptions = <T_DiScopeOptions extends DiResolutionOptions>
(
    options: T_DiScopeOptions | undefined, 
    fallback: DiResolutionOptions | undefined
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
