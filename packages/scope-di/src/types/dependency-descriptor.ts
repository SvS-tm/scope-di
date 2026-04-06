import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { AsyncDependencyDescriptor } from "./async-dependency-descriptor";
import type { ClassDependencyDescriptor } from "./class-dependency-descriptor";
import type { FactoryDependencyDescriptor } from "./factory-dependency-descriptor";
import type { ValueDependencyDescriptor } from "./value-dependency-descriptor";

export type DependencyDescriptor
<
    T_DependencyMappingKey extends AllowedDependencyKey = AllowedDependencyKey, 
    T_Dependency = unknown
> =
(
    ValueDependencyDescriptor<T_Dependency, T_DependencyMappingKey>
        | 
    ClassDependencyDescriptor<T_Dependency, T_DependencyMappingKey>
        | 
    FactoryDependencyDescriptor<T_Dependency, T_DependencyMappingKey>
        | 
    AsyncDependencyDescriptor<T_Dependency, T_DependencyMappingKey>
);
