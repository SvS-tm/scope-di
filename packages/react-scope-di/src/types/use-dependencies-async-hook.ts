import type { AwaitedResolvedDependencies, DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";

export type UseDependenciesAsyncHook<T_RegisteredDependencies extends RegisteredDependencies> =
{
    <T_ResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_ResolutionKeys
    )
        : AwaitedResolvedDependencies<T_RegisteredDependencies, T_ResolutionKeys>;
};
