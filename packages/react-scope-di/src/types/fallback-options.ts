import { ResolutionErrorFallback } from "./resolution-error-fallback";
import { ResolutionPendingFallback } from "./resolution-pending-fallback";

export type FallbackOptions = 
{
    error?: ResolutionErrorFallback;
    pending?: ResolutionPendingFallback;
};
