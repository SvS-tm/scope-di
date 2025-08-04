import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependenciesCollectionMetadata } from "./dependencies-collection-metadata";
import type { DependencyMetadata } from "./dependency-metadata";

export type RegisteredDependencies = DependenciesCollectionMetadata<AllowedDependencyKey, DependencyMetadata<any, DependencyDescriptorType>[]>;
