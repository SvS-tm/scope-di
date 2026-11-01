import type { DiResolutionOptions } from "./di-resolution-options";
import type { ResolutionPendingFallback } from "./resolution-pending-fallback";

export type DiAsyncResolutionOptions = 
(
    DiResolutionOptions
        &
    { 
        pending?: ResolutionPendingFallback; 
    }
);
