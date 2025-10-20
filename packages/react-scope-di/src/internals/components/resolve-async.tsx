import type { RegisteredDependencies } from "@svs-tm/scope-di";
import type { DiResolutionOptions } from "../../types/di-resolution-options";
import type { DiScopeComponent } from "../../types/di-scope-component";
import type { ResolveAsyncHoc } from "../../types/resolve-async-hoc";
import type { UseDependenciesAsyncHook } from "../../types/use-dependencies-async-hook";
import { fallbackDiScopeOptions } from "../helpers/di-scope-options";
import { diResolveAsync } from "./di-resolve-async";

export const createResolveAsyncHoc = 
<
    T_RegisteredDependencies extends RegisteredDependencies
>
(    
    options: DiResolutionOptions | undefined,
    DiScope: DiScopeComponent,
    useDependenciesAsync: UseDependenciesAsyncHook<T_RegisteredDependencies>
) 
    : ResolveAsyncHoc<T_RegisteredDependencies> =>
{
    return (keys, localOptions, renderer) =>
    {
        return diResolveAsync
        (
            keys, 
            fallbackDiScopeOptions(localOptions, options), 
            renderer, 
            DiScope, 
            useDependenciesAsync
        );
    };
};
