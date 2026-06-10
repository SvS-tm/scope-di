import type { AwaitedResolvedDependencies, DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";
import { asyncResolutionResultMarker } from "../internals/constants/async-resolution-result-marker";

export type AsyncResolutionResult
<
    T_RegisteredDependencies extends RegisteredDependencies, 
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
> 
    =
(
    Promise<AwaitedResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>>
        &
    {
        readonly [asyncResolutionResultMarker]: true;
    }
);
