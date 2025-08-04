import type { Constructor, Promised } from "@svs-tm/system";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyMappingKey } from "../../types/dependency-mapping-key";
import type { DependencyLifetime } from "../../types/dependency-lifetime";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { InjectedDependencies } from "../../types/utilities/injcted-dependencies";
import type { DiScopeBuilder } from "./di-scope-builder";
import type { AddDependency } from "../../types/utilities/add-dependency";
import type { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import type { DependencyFactory } from "../../types/dependency-factory";
import type { AwaitedInjectedDependencies } from "../../types/utilities/awaited-injected-dependencies";

export type DiDependentMappingBuilder
<
    T_DependencyMappingKey extends AllowedDependencyKey,
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Keys extends DependencyMappingKey<T_RegisteredDependencies>[]
> 
    =
{
    class<T_Abstraction>
    (
        constructor: Constructor<
            InjectedDependencies<T_RegisteredDependencies, T_Keys>, 
            T_Abstraction
        >,
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

    factory<T_Abstraction>
    (
        factory: DependencyFactory<
            InjectedDependencies<T_RegisteredDependencies, T_Keys>, 
            T_Abstraction
        >,
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

    classAsync<T_Abstraction>
    (
        constructor: Constructor<
            AwaitedInjectedDependencies<T_RegisteredDependencies, T_Keys>,
            Promised<T_Abstraction>
        >,
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
        
    factoryAsync<T_Abstraction>
    (
        factory: DependencyFactory<
            AwaitedInjectedDependencies<T_RegisteredDependencies, T_Keys>,
            Promise<T_Abstraction>
        >,
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
};
