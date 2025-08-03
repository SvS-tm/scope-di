import type { DependencyDescriptorType } from "./dependency-descriptor-type";

export type DependencyMetadata<T_Dependency, T_DependencyDescriptorType extends DependencyDescriptorType> = 
{
    type: T_DependencyDescriptorType;
    dependency: T_Dependency;
};
