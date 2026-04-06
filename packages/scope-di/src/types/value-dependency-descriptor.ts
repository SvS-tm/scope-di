import { AllowedDependencyKey } from "./allowed-dependency-key";
import { CommonDependencyDescriptorData } from "./common-dependency-descriptor-data";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependencyLifetime } from "./dependency-lifetime";

/**
 * @note This is descriptor type of a singleton value
 */
export type ValueDependencyDescriptor
<
    T_Dependency, 
    T_DependencyMappingKey extends AllowedDependencyKey = AllowedDependencyKey
> = 
(
    CommonDependencyDescriptorData<T_DependencyMappingKey> 
        &
    {
        type: DependencyDescriptorType.Value;
        value: T_Dependency;
        lifetime: DependencyLifetime.Singleton;
    }
);
