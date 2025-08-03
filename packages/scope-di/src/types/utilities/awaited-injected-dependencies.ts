import type { DependencyKey } from "../../types/dependency-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { AwaitedInjectionResult } from "./awaited-injection-result";

export type AwaitedInjectedDependencies
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Keys extends DependencyKey<T_RegisteredDependencies>[]
> = 
{
    [T_Key in keyof T_Keys]: AwaitedInjectionResult<T_RegisteredDependencies, T_Keys[T_Key]>;
};
