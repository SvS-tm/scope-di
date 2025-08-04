import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependencyMetadata } from "./dependency-metadata";

export type DependenciesCollectionMetadata
<
    T_Key extends AllowedDependencyKey, 
    T_Dependencies extends DependencyMetadata<any, DependencyDescriptorType>[]
> = 
{
    key: T_Key;
    dependencies: T_Dependencies;
};
