import type { RegisteredDependencies } from "@svs-tm/scope-di";
import type { UseDependenciesHook } from "./use-dependencies-hook";
import type { DiScopeComponent } from "./di-scope-component";
import type { ResolutionKeysFunction } from "./resolution-keys-function";
import type { ResolveHoc } from "./resolve-hoc";
import type { ResolutionOptionsFunction } from "./resolution-options-function";
import type { ResolveAsyncHoc } from "./resolve-async-hoc";
import type { UseDependenciesAsyncHook } from "./use-dependencies-async-hook";
import type { DiAwaitComponent } from "./di-await-component";

export type ReactDiTools<T_RegisteredDependencies extends RegisteredDependencies> = 
{
    readonly resolutionKeys: ResolutionKeysFunction<T_RegisteredDependencies>;
    readonly resolutionOptions: ResolutionOptionsFunction;
    readonly useDependencies: UseDependenciesHook<T_RegisteredDependencies>;
    readonly useDependenciesAsync: UseDependenciesAsyncHook<T_RegisteredDependencies>;
    readonly DiScope: DiScopeComponent;
    readonly DiAwait: DiAwaitComponent;
    readonly resolve: ResolveHoc<T_RegisteredDependencies>;
    readonly resolveAsync: ResolveAsyncHoc<T_RegisteredDependencies>;
};
