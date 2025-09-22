import { DiScopeOptions } from "./di-scope-options";

export type ResolvedComponentOptionsParameters = 
(
    DiScopeOptions
        &
    {
        createNewScope?: boolean;
    }
);
