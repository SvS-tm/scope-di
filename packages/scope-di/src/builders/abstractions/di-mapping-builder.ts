import type { Constructor } from "@svs-tm/system";
import type { AddDependency, AllowedDependencyKey, DependencyDescriptorType, DependencyFactory, DependencyKey, DependencyLifetime, RegisteredDependencies } from "../../types";
import type { DiDependentMappingBuilder } from "./di-dependent-mapping-builder";
import type { DiScopeBuilder } from "./di-scope-builder";

export type DiMappingBuilder
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyKey extends AllowedDependencyKey 
> =
{
    asValue<T_Abstraction>
    (
        value: T_Abstraction
    )
        : DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyKey,
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
                T_DependencyKey, 
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
                T_DependencyKey, 
                T_Abstraction, 
                DependencyDescriptorType.Factory
            >
        >;

    classAsync<T_Abstraction>
    (
        constructor: Constructor<[], Promise<T_Abstraction>>,
        lifetime: DependencyLifetime
    )
        : DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyKey, 
                Promise<T_Abstraction>, 
                DependencyDescriptorType.ClassAsync
            >
        >;  
        
    factoryAsync<T_Abstraction>
    (
        factory: DependencyFactory<[], Promise<T_Abstraction>>,
        lifetime: DependencyLifetime
    )
        : DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyKey, 
                Promise<T_Abstraction>, 
                DependencyDescriptorType.FactoryAsync
            >
        >;

    asDependent<T_Keys extends DependencyKey<T_RegisteredDependencies>[]>
    (
        ...keys: T_Keys
    )
        : DiDependentMappingBuilder<T_DependencyKey, T_RegisteredDependencies, T_Keys>;
};
