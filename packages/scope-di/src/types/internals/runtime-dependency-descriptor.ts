import { AllowedDependencyKey } from "../allowed-dependency-key";
import { DependencyDescriptor } from "../dependency-descriptor";
import { InstantiationStrategy } from "../instantiation-strategy";

export type RuntimeDependencyDescriptor
<
    T_DependencyMappingKey extends AllowedDependencyKey = AllowedDependencyKey, 
    T_Dependency = unknown,
    T_DependencyDescriptor extends DependencyDescriptor<T_DependencyMappingKey, T_Dependency> = DependencyDescriptor<T_DependencyMappingKey, T_Dependency>
> 
    = 
(
    T_DependencyDescriptor
        &
    {
        readonly instatiationStrategy: InstantiationStrategy<T_Dependency>; 
    }
);
