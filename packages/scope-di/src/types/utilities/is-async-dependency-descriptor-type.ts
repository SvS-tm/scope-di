import { DependencyDescriptorType } from "../dependency-descriptor-type";

export type IsAsyncDependencyDescriptorType
<
    T_DependencyDescriptorType extends DependencyDescriptorType, 
    T_True = true, 
    T_False = false
> =
(
    T_DependencyDescriptorType extends DependencyDescriptorType.ClassAsync | DependencyDescriptorType.FactoryAsync
        ? T_True
        : T_False
);
