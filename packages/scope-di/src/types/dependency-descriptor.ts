import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { ValueDependencyDescriptor } from "./value-dependency-descriptor";
import type { ClassDependencyDescriptor } from "./class-dependency-descriptor";
import type { FactoryDependencyDescriptor } from "./factory-dependency-descriptor";
import type { AsyncClassDependencyDescriptor } from "./async-class-dependency-descriptor";
import type { AsyncFactoryDependencyDescriptor } from "./async-factory-dependency-descriptor";
import type { CommonDependencyDescriptorData } from "./common-dependency-descriptor-data";

export type DependencyDescriptor
<
    T_DependencyKey extends AllowedDependencyKey = AllowedDependencyKey, 
    T_Dependency = unknown
> =
(
    CommonDependencyDescriptorData<T_DependencyKey>
        &
    (
        ValueDependencyDescriptor<T_Dependency>
            | 
        ClassDependencyDescriptor<T_Dependency>
            | 
        FactoryDependencyDescriptor<T_Dependency>
            | 
        AsyncClassDependencyDescriptor<T_Dependency>
            | 
        AsyncFactoryDependencyDescriptor<T_Dependency>
    )
);
