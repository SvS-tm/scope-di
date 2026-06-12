import type { Constructor } from "@svs-tm/system";
import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { CommonDependencyDescriptorData } from "./common-dependency-descriptor-data";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependencyResolutionKey } from "./dependency-resolution-key";

/**
 * @note this is descriptor of an async class construction.
 * Async dependencies will be awaited before calling constructor.
 * The actual constructor is treated as sync only work, so even if you will
 * manage to return Promise from it - this Promise will not be awaited.
 */
export type AsyncClassDependencyDescriptor
<
    T_Dependency, 
    T_DependencyMappingKey extends AllowedDependencyKey = AllowedDependencyKey
> =
(
    CommonDependencyDescriptorData<T_DependencyMappingKey>
        &
    {
        readonly type: DependencyDescriptorType.ClassAsync;
        readonly subDependenciesKeys?: DependencyResolutionKey<AllowedDependencyKey>[];
        readonly constructor: Constructor<any[], T_Dependency>;
    }
);
