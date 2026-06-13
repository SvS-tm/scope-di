import type { RegisteredDependencies } from "@svs-tm/scope-di";
import type { DiAwaitComponent } from "./di-await-component";
import type { DiScopeComponent } from "./di-scope-component";
import type { ResolutionAsyncOptionsFunction } from "./resolution-async-options-function";
import type { ResolutionOptionsFunction } from "./resolution-options-function";
import type { ResolveAsyncHoc } from "./resolve-async-hoc";
import type { ResolveHoc } from "./resolve-hoc";
import type { UseDependenciesAsyncHook } from "./use-dependencies-async-hook";
import type { UseDependenciesHook } from "./use-dependencies-hook";

export type ReactDiTools<T_RegisteredDependencies extends RegisteredDependencies> = 
{
    readonly resolutionOptions: ResolutionOptionsFunction;
    readonly asyncResolutionOptions: ResolutionAsyncOptionsFunction;
    readonly useDependencies: UseDependenciesHook<T_RegisteredDependencies>;
    readonly useDependenciesAsync: UseDependenciesAsyncHook<T_RegisteredDependencies>;
    readonly DiScope: DiScopeComponent;
    readonly DiAwait: DiAwaitComponent;
    readonly resolve: ResolveHoc<T_RegisteredDependencies>;
    readonly resolveAsync: ResolveAsyncHoc<T_RegisteredDependencies>;
};
