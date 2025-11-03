import { DiResolutionOptions } from "./di-resolution-options";
import { ResolutionPendingFallback } from "./resolution-pending-fallback";

export type DiAsyncResolutionOptions = 
(
    DiResolutionOptions
        &
    { 
        pending?: ResolutionPendingFallback; 
    }
);
