import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import type { DependencyMetadata } from "../../types/dependency-metadata";
import type { RegisteredDependencies } from "../../types/registered-dependencies";

export type AddDependency
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_NewKey extends AllowedDependencyKey,
    T_NewDependency,
    T_NewDependencyType extends DependencyDescriptorType
> = 
(
    T_RegisteredDependencies 
        & 
    {
        [T_Key in T_NewKey]: DependencyMetadata<T_NewDependency, T_NewDependencyType>;
    }
);
