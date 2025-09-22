import type { DependencyMappingKey, DependencyResolutionKey, DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import { diResolve } from "../internals/components/di-resolve";
import { diResolveAsync } from "../internals/components/di-resolve-async";
import { createDiScopeComponent } from "../internals/components/di-scope";
import { fallbackDiScopeOptions } from "../internals/helpers/di-scope-options";
import { useDiScope } from "../internals/hooks/use-di-scope";
import { useScopeDependencies } from "../internals/hooks/use-scope-dependencies";
import { useScopeDependenciesAsync } from "../internals/hooks/use-scope-dependencies-async";
import type { DiScopeOptions } from "../types/di-scope-options";
import type { ReactDiTools } from "../types/react-di-tools";
import type { UseDependenciesAsyncHook } from "../types/use-dependencies-async-hook";
import type { UseDependenciesHook } from "../types/use-dependencies-hook";

export const createReactDiTools = <T_RegisteredDependencies extends RegisteredDependencies>
(
    rootScope: DiScope<T_RegisteredDependencies>,
    options?: DiScopeOptions
)
    : ReactDiTools<T_RegisteredDependencies> =>
{
    const DiScope = createDiScopeComponent(rootScope, options);

    const useDependencies: UseDependenciesHook<T_RegisteredDependencies> = (...keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]) =>
    {
        const scope = useDiScope({ rootScope });

        /**
         * @todo proper cast
         */
        return useScopeDependencies(scope, keys) as any;
    };

    const useDependenciesAsync: UseDependenciesAsyncHook<T_RegisteredDependencies> = (...keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]) =>
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
        resolutionOptions: (options) => options,
        resolve: (keys, localOptions, renderer) => diResolve
        (
            keys, 
            fallbackDiScopeOptions(localOptions, options), 
            renderer, 
            DiScope, 
            useDependencies
        ),
        resolveAsync: (keys, localOptions, renderer) => diResolveAsync
        (
            keys, 
            fallbackDiScopeOptions(localOptions, options), 
            renderer, 
            DiScope, 
            useDependenciesAsync
        ),
    };
};
