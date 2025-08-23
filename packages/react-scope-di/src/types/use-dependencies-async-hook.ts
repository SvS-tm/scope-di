import type { AwaitedResolutionResult, AwaitedResolvedDependencies, DependenciesCollectionResolutionKey, DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";

export type UseDependenciesAsyncHook<T_RegisteredDependencies extends RegisteredDependencies> =
{
    <T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
    (
        key: T_DependencyMappingKey
    )
        : AwaitedResolutionResult<T_RegisteredDependencies, T_DependencyMappingKey>;

    <T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
    (
        key: DependenciesCollectionResolutionKey<T_DependencyMappingKey>
    )
        : AwaitedResolutionResult<T_RegisteredDependencies, DependenciesCollectionResolutionKey<T_DependencyMappingKey>>;

    <T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_DependencyResolutionKeys
    )
        : AwaitedResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>;
};
