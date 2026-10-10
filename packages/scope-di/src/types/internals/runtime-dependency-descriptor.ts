import { AllowedDependencyKey } from "../allowed-dependency-key";
import { DependencyDescriptor } from "../dependency-descriptor";
import { InstantiationStrategy } from "../instantiation-strategy";

export type RuntimeDependencyDescriptor
<
    T_DependencyMappingKey extends AllowedDependencyKey = AllowedDependencyKey, 
    T_Dependency = unknown
> 
    = 
(
    DependencyDescriptor<T_DependencyMappingKey, T_Dependency>
        &
    {
        readonly instatiationStrategy: InstantiationStrategy<T_Dependency>; 
    }
);
