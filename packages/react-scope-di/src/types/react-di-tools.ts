import type { RegisteredDependencies } from "@svs-tm/scope-di";
import type { UseDependenciesHook } from "./use-dependencies-hook";
import type { UseDependenciesAsyncHook } from "./use-dependencies-async-hook";
import type { DiScopeComponent } from "./di-scope-component";
import type { ResolutionKeysFunction } from "./resolution-keys-function";
import type { ResolveHoc } from "./resolve-hoc";

export type ReactDiTools<T_RegisteredDependencies extends RegisteredDependencies> = 
{
    readonly resolutionKeys: ResolutionKeysFunction<T_RegisteredDependencies>;
    readonly useDependencies: UseDependenciesHook<T_RegisteredDependencies>;
    readonly useDependenciesAsync: UseDependenciesAsyncHook<T_RegisteredDependencies>;
    readonly DiScope: DiScopeComponent;
    readonly resolve: ResolveHoc<T_RegisteredDependencies>;
};
