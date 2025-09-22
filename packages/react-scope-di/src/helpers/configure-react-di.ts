import type { DependencyMappingKey, DependencyResolutionKey, DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import { diResolve } from "../internals/components/di-resolve";
import { createDiScopeComponent } from "../internals/components/di-scope";
import { useDiScope } from "../internals/hooks/use-di-scope";
import { useScopeDependencies } from "../internals/hooks/use-scope-dependencies";
import { useScopeDependenciesAsync } from "../internals/hooks/use-scope-dependencies-async";
import type { DiScopeOptions } from "../types/di-scope-options";
import type { ReactDiTools } from "../types/react-di-tools";

export const configureReactDi = <T_RegisteredDependencies extends RegisteredDependencies>
(
    rootScope: DiScope<T_RegisteredDependencies>,
    options?: DiScopeOptions
) 
    : ReactDiTools<T_RegisteredDependencies> =>
{
    const DiScope = createDiScopeComponent(rootScope, options);

    const useDependencies = (...keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]) =>
    {
        const scope = useDiScope({ rootScope });

        /**
         * @todo proper cast
         */
        return useScopeDependencies(scope, keys) as any;
    };

    const useDependenciesAsync = (...keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]) =>
    {
        const scope = useDiScope({ rootScope });

        /**
         * @todo proper cast
         */
        return useScopeDependenciesAsync(scope, keys) as any;
    };

    return {
        useDependencies,
        useDependenciesAsync,
        DiScope,
        resolutionKeys: (...keys) => keys,
        resolve: (keys, options, renderer) =>
            diResolve(keys, options, renderer, DiScope, useDependencies)
    };
};
