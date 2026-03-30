import type { DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import { DiAwait } from "../internals/components/di-await";
import { createDiScopeComponent } from "../internals/components/di-scope";
import { createResolveHoc } from "../internals/components/resolve";
import { createResolveAsyncHoc } from "../internals/components/resolve-async";
import { createUseDependenciesAsyncHook } from "../internals/hooks/use-dependencies-async";
import { createUseDependenciesHook } from "../internals/hooks/use-dependencies";
import type { ResolutionKeysFunction } from "../types";
import type { DiResolutionOptions } from "../types/di-resolution-options";
import type { ReactDiTools } from "../types/react-di-tools";
import type { ResolutionOptionsFunction } from "../types/resolution-options-function";

export const createReactDiTools = <T_RegisteredDependencies extends RegisteredDependencies>
(
    rootScope: DiScope<T_RegisteredDependencies>,
    options?: DiResolutionOptions
)
    : ReactDiTools<T_RegisteredDependencies> =>
{
    const DiScope = createDiScopeComponent(rootScope);
    const useDependencies = createUseDependenciesHook(rootScope);
    const useDependenciesAsync = createUseDependenciesAsyncHook(rootScope);
    const resolve = createResolveHoc(options, DiScope, useDependencies);
    const resolveAsync = createResolveAsyncHoc(options, DiScope, useDependenciesAsync);
    const resolutionOptionsFunction: ResolutionOptionsFunction = (options) => options;
    const resolutionKeysFunction: ResolutionKeysFunction<T_RegisteredDependencies> = (...keys) => keys;

    return {
        useDependencies,
        useDependenciesAsync,
        DiScope,
        DiAwait,
        resolutionKeys: resolutionKeysFunction,
        resolutionOptions: resolutionOptionsFunction,
        asyncResolutionOptions: resolutionOptionsFunction,
        resolve,
        resolveAsync
    };
};
