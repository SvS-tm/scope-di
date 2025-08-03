import type { Constructor, Promised } from "@svs-tm/system";
import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependencyDescriptorType } from "./dependency-descriptor-type";

/**
 * @note this is descriptor of an async class construction.
 * Async dependencies will be awaited before calling constructor.
 * It can return promise as well.
 */
export type AsyncClassDependencyDescriptor<T_Dependency> =
{
    type: DependencyDescriptorType.ClassAsync;
    subDependenciesKeys?: AllowedDependencyKey[];
    constructor: Constructor<any[], Promised<T_Dependency>>;
};
