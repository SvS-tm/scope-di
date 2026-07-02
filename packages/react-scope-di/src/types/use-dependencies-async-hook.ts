import type { DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";
import type { AsyncResolutionResult } from "./async-resolution-result";

export type UseDependenciesAsyncHook<T_RegisteredDependencies extends RegisteredDependencies> =
{
    <const T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_DependencyResolutionKeys
    )
        : AsyncResolutionResult<T_RegisteredDependencies, T_DependencyResolutionKeys>;
};
