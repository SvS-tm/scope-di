import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";

export type IsAllowedDependencyKey<T_DependencyMappingKey> = T_DependencyMappingKey extends AllowedDependencyKey
    ? T_DependencyMappingKey
    : never;
