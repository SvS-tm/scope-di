import type { AllowedDependencyKey } from "../allowed-dependency-key";
import type { DependenciesCollectionMetadata } from "../dependencies-collection-metadata";
import type { RegisteredDependencies } from "../registered-dependencies";

export type GetDependenciesCollectionMetadata
<
    T_RegisteredDependencies extends RegisteredDependencies, 
    T_Key extends AllowedDependencyKey
> =
(
    T_RegisteredDependencies extends DependenciesCollectionMetadata<T_Key, any>
        ? T_RegisteredDependencies
        : never
);
