export enum DependencyResolutionTraceResult
{
    /**
     * Fully sync resolution (no async dependencies found in chain)
     */
    Sync = 0,

    /**
     * There were some async dependencies, but all of them are settled,
     * (so no real async work will be scheduled for this resolution)
     */
    AsyncSettled = 1,

    /**
     * There were some async dependencies, and they are potentially not resolved yet
     * (so most likely some real async work will be scheduled for this resolution)
     */
    Async = 2
}
