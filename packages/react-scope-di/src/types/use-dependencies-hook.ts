import type { DependenciesCollectionResolutionKey, DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies, ResolutionResult, ResolvedDependencies } from "@svs-tm/scope-di";

export type UseDependenciesHook<T_RegisteredDependencies extends RegisteredDependencies> =
{
    <T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
    (
        key: T_DependencyMappingKey
    )
        : ResolutionResult<T_RegisteredDependencies, T_DependencyMappingKey>;

    <T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
    (
        key: DependenciesCollectionResolutionKey<T_DependencyMappingKey>
    )
        : ResolutionResult<T_RegisteredDependencies, DependenciesCollectionResolutionKey<T_DependencyMappingKey>>;

    <T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_DependencyResolutionKeys
    )
        : ResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>;
};
