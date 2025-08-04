import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependenciesCollectionResolutionKey } from "./dependencies-collection-resolution-key";

export type DependencyResolutionKey<T_DependencyMappingKey extends AllowedDependencyKey> = 
    T_DependencyMappingKey | DependenciesCollectionResolutionKey<T_DependencyMappingKey>;
