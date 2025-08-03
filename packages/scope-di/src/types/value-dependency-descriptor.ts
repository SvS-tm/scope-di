import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependencyLifetime } from "./dependency-lifetime";

/**
 * @note This is descriptor type of a singleton value
 */
export type ValueDependencyDescriptor<T_Dependency> = 
{
    type: DependencyDescriptorType.Value;
    value: T_Dependency;
    lifetime: DependencyLifetime.Singleton;
};
