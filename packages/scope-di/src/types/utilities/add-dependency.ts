import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import type { DependenciesCollectionMetadata } from "../dependencies-collection-metadata";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { RemoveDependenciesCollection } from "./remove-dependencies-collection";
import type { DependencyMetadata } from "../dependency-metadata";
import type { IsNever } from "@svs-tm/system";
import type { GetDependenciesCollectionMetadata } from "./get-dependencies-collection-metadata";

export type AddDependency
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_NewKey extends AllowedDependencyKey,
    T_NewDependency,
    T_NewDependencyType extends DependencyDescriptorType
> = 
(
    RemoveDependenciesCollection<T_RegisteredDependencies, T_NewKey>
        |
    DependenciesCollectionMetadata<
        T_NewKey, 
        [
            DependencyMetadata<T_NewDependency, T_NewDependencyType>, 
            ...(IsNever<GetDependenciesCollectionMetadata<T_RegisteredDependencies, T_NewKey>["dependencies"]> extends false
                ? GetDependenciesCollectionMetadata<T_RegisteredDependencies, T_NewKey>["dependencies"]
                : []
            )
        ]
    >
);
