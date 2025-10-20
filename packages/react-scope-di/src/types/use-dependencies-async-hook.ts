import type { AwaitedResolvedDependencies, DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";

export type UseDependenciesAsyncHook<T_RegisteredDependencies extends RegisteredDependencies> =
{
    <T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_DependencyResolutionKeys
    )
        : Promise<AwaitedResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>>;
};
