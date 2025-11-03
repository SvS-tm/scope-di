import type { RegisteredDependencies } from "@svs-tm/scope-di";
import type { UseDependenciesHook } from "../../types";
import type { DiResolutionOptions } from "../../types/di-resolution-options";
import type { DiScopeComponent } from "../../types/di-scope-component";
import type { ResolveHoc } from "../../types/resolve-hoc";
import { compose } from "../helpers/compose";
import { diResolve } from "./di-resolve";

export const createResolveHoc = 
<
    T_RegisteredDependencies extends RegisteredDependencies
>
(    
    options: DiResolutionOptions | undefined,
    DiScope: DiScopeComponent,
    useDependencies: UseDependenciesHook<T_RegisteredDependencies>
) 
    : ResolveHoc<T_RegisteredDependencies> =>
{
    return (keys, localOptions, renderer) => 
    {
        return diResolve
        (
            keys, 
            compose(localOptions, options), 
            renderer, 
            DiScope, 
            useDependencies
        );
    };
};
