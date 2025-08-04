import type { dependenciesCollectionType } from "../constants/internals/dependencies-collection-type";
import type { AllowedDependencyKey } from "./allowed-dependency-key";

export type DependenciesCollectionResolutionKey<T_DependencyMappingKey extends AllowedDependencyKey> = 
{
    type: typeof dependenciesCollectionType;
    mappingKey: T_DependencyMappingKey;
};
