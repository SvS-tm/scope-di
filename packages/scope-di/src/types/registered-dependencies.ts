import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependencyMetadata } from "./dependency-metadata";

export type RegisteredDependencies = 
{
    [T_Key in AllowedDependencyKey]: DependencyMetadata<any, DependencyDescriptorType>;
};
