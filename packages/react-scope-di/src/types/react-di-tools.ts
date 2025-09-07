import type { RegisteredDependencies } from "@svs-tm/scope-di";
import type { UseDependenciesHook } from "./use-dependencies-hook";
import type { UseDependenciesAsyncHook } from "./use-dependencies-async-hook";
import type { DiScopeComponent } from "./di-scope-component";

export type ReactDiTools<T_RegisteredDependencies extends RegisteredDependencies> = 
{
    readonly useDependencies: UseDependenciesHook<T_RegisteredDependencies>;
    readonly useDependenciesAsync: UseDependenciesAsyncHook<T_RegisteredDependencies>;
    readonly DiScope: DiScopeComponent;
};
