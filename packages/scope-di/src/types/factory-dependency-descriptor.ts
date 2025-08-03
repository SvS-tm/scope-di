import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependencyFactory } from "./dependency-factory";

/**
 * @note this is descriptor of a factory function.
 * All dependencies will be injected as they are
 * (async dependencies as promises)
 */
export type FactoryDependencyDescriptor<T_Dependency> =
{
    type: DependencyDescriptorType.Factory;
    subDependenciesKeys?: AllowedDependencyKey[];
    factory: DependencyFactory<any[], T_Dependency>;
};
