import type { AllowedDependencyKey } from "../allowed-dependency-key";
import type { RegisteredDependencies } from "../registered-dependencies";
import type { GetDependenciesCollectionMetadata } from "./get-dependencies-collection-metadata";

export type GetDefaultDependencyMetadata
<
    T_RegisteredDependencies extends RegisteredDependencies, 
    T_DependencyMappingKey extends AllowedDependencyKey
> = 
    GetDependenciesCollectionMetadata<T_RegisteredDependencies, T_DependencyMappingKey>["dependencies"][0];
