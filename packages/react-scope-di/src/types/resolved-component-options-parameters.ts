import { DiResolutionOptions } from "./di-resolution-options";

export type ResolvedComponentOptionsParameters = 
(
    DiResolutionOptions
        &
    {
        createNewScope?: boolean;
    }
);
