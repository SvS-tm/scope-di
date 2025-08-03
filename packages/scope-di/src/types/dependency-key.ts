import type { RegisteredDependencies } from "./registered-dependencies";
import type { IsAllowedDependencyKey } from "./utilities/is-allowed-dependency-key";

export type DependencyKey<T_RegisteredDependencies extends RegisteredDependencies> = 
    IsAllowedDependencyKey<keyof T_RegisteredDependencies>;
