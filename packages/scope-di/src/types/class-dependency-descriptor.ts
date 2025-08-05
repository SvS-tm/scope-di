import type { Constructor } from "@svs-tm/system";
import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";
import type { DependencyResolutionKey } from "./dependency-resolution-key";

/**
 * @note this is descriptor of a class constructor.
 * All dependencies will be injected as they are
 * (async dependencies as promises)
 */
export type ClassDependencyDescriptor<T_Dependency> =
{
    type: DependencyDescriptorType.Class;
    subDependenciesKeys?: DependencyResolutionKey<AllowedDependencyKey>[];
    constructor: Constructor<any[], T_Dependency>;
};
