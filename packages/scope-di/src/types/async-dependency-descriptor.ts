import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { AsyncClassDependencyDescriptor } from "./async-class-dependency-descriptor";
import type { AsyncFactoryDependencyDescriptor } from "./async-factory-dependency-descriptor";

export type AsyncDependencyDescriptor
<
    T_Dependency = unknown,
    T_DependencyMappingKey extends AllowedDependencyKey = AllowedDependencyKey
> =
(
    AsyncClassDependencyDescriptor<T_Dependency, T_DependencyMappingKey>
        | 
    AsyncFactoryDependencyDescriptor<T_Dependency, T_DependencyMappingKey>
);
