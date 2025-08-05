import type { RegisteredDependencies } from "./registered-dependencies";
import type { IsAllowedDependencyKey } from "./utilities/is-allowed-dependency-key";

export type DependencyMappingKey<T_RegisteredDependencies extends RegisteredDependencies> = 
    IsAllowedDependencyKey<T_RegisteredDependencies["key"]>;
