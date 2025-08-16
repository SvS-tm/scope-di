import type { RegisteredDependencies } from "../registered-dependencies";
import type { DependencyMappingKey } from "../dependency-mapping-key";
import type { DependencyResolutionKey } from "../dependency-resolution-key";
import type { ResolutionResult } from "./resolution-result";

export type ResolvedDependencies
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Keys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
> = 
{
    [T_Index in keyof T_Keys]: ResolutionResult<T_RegisteredDependencies, T_Keys[T_Index]>;
};
