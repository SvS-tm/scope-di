import type { Constructor } from "@svs-tm/system";
import type { AddDependency, AllowedDependencyKey, DependencyDescriptorType, DependencyFactory, DependencyMappingKey, DependencyLifetime, RegisteredDependencies, DependencyResolutionKey } from "../../types";
import type { DiDependentMappingBuilder } from "./di-dependent-mapping-builder";
import type { DiScopeBuilder } from "./di-scope-builder";

export type DiMappingBuilder
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyMappingKey extends AllowedDependencyKey 
> =
{
    asValue<T_Abstraction>
    (
        value: T_Abstraction
    )
        : DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey,
                T_Abstraction,
                DependencyDescriptorType.Value
            >
        >;

    asClass<T_Abstraction>
    (
        target: Constructor<[], T_Abstraction>,
        lifetime: DependencyLifetime
    )
        : DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
                T_Abstraction, 
                DependencyDescriptorType.Class
            >
        >;
    
    asFactory<T_Abstraction>
    (
        factory: DependencyFactory<[], T_Abstraction>,
        lifetime: DependencyLifetime
    )
        : DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
                T_Abstraction, 
                DependencyDescriptorType.Factory
            >
        >;

    asClassAsync<T_Abstraction>
    (
        constructor: Constructor<[], Promise<T_Abstraction>>,
        lifetime: DependencyLifetime
    )
        : DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
                Promise<T_Abstraction>, 
                DependencyDescriptorType.ClassAsync
            >
        >;  
        
    asFactoryAsync<T_Abstraction>
    (
        factory: DependencyFactory<[], Promise<T_Abstraction>>,
        lifetime: DependencyLifetime
    )
        : DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
                Promise<T_Abstraction>, 
                DependencyDescriptorType.FactoryAsync
            >
        >;

    asDependent<T_Keys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_Keys
    )
        : DiDependentMappingBuilder<T_DependencyMappingKey, T_RegisteredDependencies, T_Keys>;
};
