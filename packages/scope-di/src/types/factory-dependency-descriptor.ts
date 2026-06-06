import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { CommonDependencyDescriptorData } from "./common-dependency-descriptor-data";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependencyFactory } from "./dependency-factory";
import type { DependencyResolutionKey } from "./dependency-resolution-key";

/**
 * @note this is descriptor of a factory function.
 * All dependencies will be injected as they are
 * (async dependencies as promises)
 */
export type FactoryDependencyDescriptor
<
    T_Dependency, 
    T_DependencyMappingKey extends AllowedDependencyKey = AllowedDependencyKey
> =
(
    CommonDependencyDescriptorData<T_DependencyMappingKey>
        &
    {
        readonly type: DependencyDescriptorType.Factory;
        readonly subDependenciesKeys?: DependencyResolutionKey<AllowedDependencyKey>[];
        readonly factory: DependencyFactory<any[], T_Dependency>;
    }
);
