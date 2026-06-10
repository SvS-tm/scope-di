import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { CommonDependencyDescriptorData } from "./common-dependency-descriptor-data";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependencyFactory } from "./dependency-factory";
import type { DependencyResolutionKey } from "./dependency-resolution-key";

/**
 * @note this is descriptor of an async factory function.
 * Async dependencies will be awaited before calling factory method.
 * It can return promise as well.
 */
export type AsyncFactoryDependencyDescriptor
<
    T_Dependency, 
    T_DependencyMappingKey extends AllowedDependencyKey = AllowedDependencyKey
> =
(
    CommonDependencyDescriptorData<T_DependencyMappingKey>
        &
    {
        readonly type: DependencyDescriptorType.FactoryAsync;
        readonly subDependenciesKeys?: DependencyResolutionKey<AllowedDependencyKey>[];
        readonly factory: DependencyFactory<any[], Promise<T_Dependency>>;
    }
);
