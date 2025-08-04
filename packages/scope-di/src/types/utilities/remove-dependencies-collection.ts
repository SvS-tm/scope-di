import type { RegisteredDependencies } from "../registered-dependencies";
import type { AllowedDependencyKey } from "../allowed-dependency-key"; 
import type { DependenciesCollectionMetadata } from "../dependencies-collection-metadata";

export type RemoveDependenciesCollection
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_ExistingKey extends AllowedDependencyKey
> = 
(
    T_RegisteredDependencies extends DependenciesCollectionMetadata<T_ExistingKey, any>
        ? never
        : T_RegisteredDependencies
);
