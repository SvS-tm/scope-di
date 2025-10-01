import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependencyFactory } from "./dependency-factory";
import type { DependencyResolutionKey } from "./dependency-resolution-key";

/**
 * @note this is descriptor of an async factory function.
 * Async dependencies will be awaited before calling factory method.
 * It can return promise as well.
 */
export type AsyncFactoryDependencyDescriptor<T_Dependency> =
{
    type: DependencyDescriptorType.FactoryAsync;
    subDependenciesKeys?: DependencyResolutionKey<AllowedDependencyKey>[];
    factory: DependencyFactory<any[], Promise<T_Dependency>>;
};
