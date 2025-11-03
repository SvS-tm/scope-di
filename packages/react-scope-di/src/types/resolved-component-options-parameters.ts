export type ResolvedComponentOptionsParameters<T_ResolutionOptions> = 
(
    T_ResolutionOptions
        &
    {
        createNewScope?: boolean;
    }
);
