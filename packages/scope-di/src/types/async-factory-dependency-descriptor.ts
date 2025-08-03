import type { Promised } from "@svs-tm/system";
import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependencyFactory } from "./dependency-factory";

/**
 * @note this is descriptor of an async factory function.
 * Async dependencies will be awaited before calling factory method.
 * It can return promise as well.
 */
export type AsyncFactoryDependencyDescriptor<T_Dependency> =
{
    type: DependencyDescriptorType.FactoryAsync;
    subDependenciesKeys?: AllowedDependencyKey[];
    factory: DependencyFactory<any[], Promised<T_Dependency>>;
};
