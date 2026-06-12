import type { Constructor } from "@svs-tm/system";
import type { DependencyResolutionKey } from "../types";
import type { AllowedDependencyKey } from "../types/allowed-dependency-key";
import type { DependencyDescriptorType } from "../types/dependency-descriptor-type";
import type { DependencyFactory } from "../types/dependency-factory";
import type { DependencyLifetime } from "../types/dependency-lifetime";
import type { DependencyMappingKey } from "../types/dependency-mapping-key";
import type { RegisteredDependencies } from "../types/registered-dependencies";
import type { AddDependency } from "../types/utilities/add-dependency";
import type { AwaitedResolvedDependencies } from "../types/utilities/awaited-resolved-dependencies";
import type { ResolvedDependencies } from "../types/utilities/resolved-dependencies";
import type { DiScopeBuilder } from "./di-scope-builder";

export type DiDependentMappingBuilder
<

    T_DependencyMappingKey extends AllowedDependencyKey,
    T_RegisteredDependencies extends RegisteredDependencies,
    T_ResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
>
    =
{
    class<T_Abstraction>
    (
        constructor: Constructor<
            ResolvedDependencies<T_RegisteredDependencies, T_ResolutionKeys>, 
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

    factory<const T_Abstraction>
    (
        factory: DependencyFactory<
            ResolvedDependencies<T_RegisteredDependencies, T_ResolutionKeys>, 
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
            AwaitedResolvedDependencies<T_RegisteredDependencies, T_ResolutionKeys>,
            T_Abstraction
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
        
    factoryAsync<const T_Abstraction>
    (
        factory: DependencyFactory<
            AwaitedResolvedDependencies<T_RegisteredDependencies, T_ResolutionKeys>,
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
