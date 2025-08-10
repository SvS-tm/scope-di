import type { AllowedDependencyKey } from "./allowed-dependency-key";

export type DependenciesCollectionResolutionKey<T_DependencyMappingKey extends AllowedDependencyKey> = 
    [T_DependencyMappingKey];
