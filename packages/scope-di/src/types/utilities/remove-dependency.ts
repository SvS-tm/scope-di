import type { DependencyKey } from "../../types/dependency-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";

export type RemoveDependency
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_ExistingKey extends DependencyKey<T_RegisteredDependencies>
> = 
{
    [T_Key in Exclude<keyof T_RegisteredDependencies, T_ExistingKey>]: T_RegisteredDependencies[T_Key];
};
