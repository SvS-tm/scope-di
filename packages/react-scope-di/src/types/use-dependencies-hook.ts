import type { RegisteredDependencies, DependencyMappingKey, ResolvedDependencies, DependencyResolutionKey } from "@svs-tm/scope-di";

export type UseDependenciesHook<T_RegisteredDependencies extends RegisteredDependencies> =
{
    <T_ResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_ResolutionKeys
    )
        : ResolvedDependencies<T_RegisteredDependencies, T_ResolutionKeys>;
};
