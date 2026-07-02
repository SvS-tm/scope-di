import type { DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies, ResolvedDependencies } from "@svs-tm/scope-di";

export type UseDependenciesHook<T_RegisteredDependencies extends RegisteredDependencies> =
{
    <const T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_DependencyResolutionKeys
    )
        : ResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>;
};
