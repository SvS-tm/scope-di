import type { Constructor } from "@svs-tm/system";
import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependencyResolutionKey } from "./dependency-resolution-key";
import type { CommonDependencyDescriptorData } from "./common-dependency-descriptor-data";

/**
 * @note this is descriptor of a class constructor.
 * All dependencies will be injected as they are
 * (async dependencies as promises)
 */
export type ClassDependencyDescriptor
<
    T_Dependency, 
    T_DependencyMappingKey extends AllowedDependencyKey = AllowedDependencyKey
> =
(
    CommonDependencyDescriptorData<T_DependencyMappingKey>
        &
    {
        readonly type: DependencyDescriptorType.Class;
        readonly subDependenciesKeys?: DependencyResolutionKey<AllowedDependencyKey>[];
        readonly constructor: Constructor<any[], T_Dependency>;
    }
);
