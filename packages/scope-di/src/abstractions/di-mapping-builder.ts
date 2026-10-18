import type { Constructor } from "@svs-tm/system";
import type { AddDependency, AllowedDependencyKey, DependencyDescriptorType, DependencyFactory, DependencyMappingKey, DependencyLifetime, RegisteredDependencies, DependencyResolutionKey } from "../types";
import type { DiDependentMappingBuilder } from "./di-dependent-mapping-builder";
import type { DiScopeBuilder } from "./di-scope-builder";
import { DiFeatures } from "../types/di-features";

export type DiMappingBuilder
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Features extends DiFeatures,
    T_DependencyMappingKey extends AllowedDependencyKey 
> =
{
    asValue<const T_Abstraction>
    (
        value: T_Abstraction
    )
        : DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey,
                T_Abstraction,
                DependencyDescriptorType.Value
            >,
            T_Features
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
            >,
            T_Features
        >;
    
    asFactory<const T_Abstraction>
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
            >,
            T_Features
        >;

    asClassAsync<T_Abstraction>
    (
        constructor: Constructor<[], T_Abstraction>,
        lifetime: DependencyLifetime
    )
        : DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
                Promise<T_Abstraction>, 
                DependencyDescriptorType.ClassAsync
            >,
            T_Features
        >;  
        
    asFactoryAsync<const T_Abstraction>
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
            >,
            T_Features
        >;

    asDependent<const T_Keys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_Keys
    )
        : DiDependentMappingBuilder<T_DependencyMappingKey, T_RegisteredDependencies, T_Features, T_Keys>;
};
