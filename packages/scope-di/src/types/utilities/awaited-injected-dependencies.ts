import type { DependencyMappingKey } from "../dependency-mapping-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { AwaitedInjectionResult } from "./awaited-injection-result";

export type AwaitedInjectedDependencies
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Keys extends DependencyMappingKey<T_RegisteredDependencies>[]
> = 
{
    [T_DependencyMappingKey in keyof T_Keys]: AwaitedInjectionResult<T_RegisteredDependencies, T_Keys[T_DependencyMappingKey]>;
};
