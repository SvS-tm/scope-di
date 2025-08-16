import type { DependencyMappingKey } from "../dependency-mapping-key";
import type { RegisteredDependencies } from "../registered-dependencies";
import type { AwaitedResolutionResult } from "./awaited-resolution-result";
import type { DependencyResolutionKey } from "../dependency-resolution-key";

export type AwaitedResolvedDependencies
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Keys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
> = 
{
    [T_DependencyResolutionKey in keyof T_Keys]: AwaitedResolutionResult<T_RegisteredDependencies, T_Keys[T_DependencyResolutionKey]>;
};
