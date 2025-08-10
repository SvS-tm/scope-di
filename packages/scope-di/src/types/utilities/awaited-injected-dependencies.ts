import type { DependencyMappingKey } from "../dependency-mapping-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { AwaitedInjectionResult } from "./awaited-injection-result";
import { DependencyResolutionKey } from "../dependency-resolution-key";

export type AwaitedInjectedDependencies
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Keys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
> = 
{
    [T_DependencyResolutionKey in keyof T_Keys]: AwaitedInjectionResult<T_RegisteredDependencies, T_Keys[T_DependencyResolutionKey]>;
};
