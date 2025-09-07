import type 
{
    AwaitedResolutionResult,
    AwaitedResolvedDependencies,
    DependenciesCollectionResolutionKey,
    DependencyMappingKey,
    DependencyResolutionKey,
    DiScope,
    RegisteredDependencies,
    ResolutionResult,
    ResolvedDependencies
} from "@svs-tm/scope-di";
import { createDiScopeComponent } from "../internals/components/di-scope";
import { suspendedAwait } from "../internals/helpers/promise";
import { useDiScope } from "../internals/hooks/use-di-scope";
import type { ReactDiOptions } from "../types/react-di-options";
import type { ReactDiTools } from "../types/react-di-tools";

export const configureReactDi = <T_RegisteredDependencies extends RegisteredDependencies>
(
    rootScope: DiScope<T_RegisteredDependencies>,
    options?: ReactDiOptions
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

        /**
         * @todo investigate how to cast it properly
         */
        return suspendedAwait(promise) as any;
    }

    const DiScope = createDiScopeComponent(rootScope, options);

    return {
        useDependencies,
        useDependenciesAsync,
        DiScope
    };
};
