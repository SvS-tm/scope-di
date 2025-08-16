import { RegisteredDependencies } from "@svs-tm/scope-di";
import { UseDependenciesHook } from "./use-dependencies-hook";
import { UseDependenciesAsyncHook } from "./use-dependencies-async-hook";

export type ReactDiTools<T_RegisteredDependencies extends RegisteredDependencies> = 
{
    useDependencies: UseDependenciesHook<T_RegisteredDependencies>;
    useDependenciesAsync: UseDependenciesAsyncHook<T_RegisteredDependencies>;
};
