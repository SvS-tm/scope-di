import { type AwaitedResolutionResult, type AwaitedResolvedDependencies, type DependenciesCollectionResolutionKey, type DependencyMappingKey, type DependencyResolutionKey, type DiScope, type RegisteredDependencies, type ResolutionResult, type ResolvedDependencies } from "@svs-tm/scope-di";
import { suspendedAwait } from "../internals/helpers/promise";
import { useDiScope } from "../internals/hooks/use-di-scope";
import type { ReactDiTools } from "../types/react-di-tools";

export const configureReactDi = <T_RegisteredDependencies extends RegisteredDependencies>
(
    rootScope: DiScope<T_RegisteredDependencies>
) 
    : ReactDiTools<T_RegisteredDependencies> =>
{
    function useDependencies<T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
    (
        key: T_DependencyMappingKey
    )
        : ResolutionResult<T_RegisteredDependencies, T_DependencyMappingKey>;

    function useDependencies<T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
    (
        key: DependenciesCollectionResolutionKey<T_DependencyMappingKey>
    )
        : ResolutionResult<T_RegisteredDependencies, DependenciesCollectionResolutionKey<T_DependencyMappingKey>>;

    function useDependencies<T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_DependencyResolutionKeys
    )
        : ResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>;

    function useDependencies<T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_DependencyResolutionKeys
    )
    {
        const scope = useDiScope({ rootScope });

        return scope.resolve(...keys);
    }

    function useDependenciesAsync<T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
    (
        key: T_DependencyMappingKey
    )
        : AwaitedResolutionResult<T_RegisteredDependencies, T_DependencyMappingKey>;

    function useDependenciesAsync<T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
    (
        key: DependenciesCollectionResolutionKey<T_DependencyMappingKey>
    )
        : AwaitedResolutionResult<T_RegisteredDependencies, DependenciesCollectionResolutionKey<T_DependencyMappingKey>>;

    function useDependenciesAsync<T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_DependencyResolutionKeys
    )
        : AwaitedResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>;

    function useDependenciesAsync<T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_DependencyResolutionKeys
    )
    {
        const scope = useDiScope({ rootScope });

        const promise = scope.resolveAsync(...keys);

        return suspendedAwait(promise);
    }

    return {
        useDependencies,
        useDependenciesAsync
    };
};
