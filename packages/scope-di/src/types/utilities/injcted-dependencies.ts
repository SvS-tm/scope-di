import type { DependencyKey } from "../../types/dependency-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { InjectionResult } from "./injection-result";

export type InjectedDependencies
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Keys extends DependencyKey<T_RegisteredDependencies>[]
> = 
{
    [T_Index in keyof T_Keys]: InjectionResult<T_RegisteredDependencies, T_Keys[T_Index]>;
};
