import type { Constructor, Promised } from "@svs-tm/system";
import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependencyResolutionKey } from "./dependency-resolution-key";
import type { CommonDependencyDescriptorData } from "./common-dependency-descriptor-data";

/**
 * @note this is descriptor of an async class construction.
 * Async dependencies will be awaited before calling constructor.
 * It can return promise as well.
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
        readonly constructor: Constructor<any[], Promised<T_Dependency>>;
    }
);
