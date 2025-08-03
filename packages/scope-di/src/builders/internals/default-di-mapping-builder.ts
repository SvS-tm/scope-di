import type { Constructor, Delegate } from "@svs-tm/system";
import type { DependencyFactory } from "../../types";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import type { DependencyKey } from "../../types/dependency-key";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { AddDependency } from "../../types/utilities/add-dependency";
import type { DiMappingBuilder, DiScopeBuilder } from "../abstractions";
import { DefaultDiDependentMappingBuilder } from "./default-di-dependent-mapping-builder";
import type { DefaultDiScopeBuilder } from "./default-di-scope-builder";

export class DefaultDiMappingBuilder
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyKey extends AllowedDependencyKey 
>
    implements DiMappingBuilder<T_RegisteredDependencies, T_DependencyKey>
{
    public constructor
    (
        private readonly diScopeBuilder: DefaultDiScopeBuilder<T_RegisteredDependencies>,
        private readonly key: T_DependencyKey
    )
    {
    }

    public readonly classAsync = <T_Abstraction>
    (
        constructor: Constructor<[], Promise<T_Abstraction>>, 
        lifetime: DependencyLifetime
    ) =>
    {
        this.diScopeBuilder.register
        (
            {
                type: DependencyDescriptorType.ClassAsync,
                key: this.key,
                constructor,
                lifetime
            }
        );

        return this.diScopeBuilder as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyKey, 
                Promise<T_Abstraction>, 
                DependencyDescriptorType.ClassAsync
            >
        >;
    };

    public readonly factoryAsync = <T_Abstraction>
    (
        factory: DependencyFactory<[], Promise<T_Abstraction>>, 
        lifetime: DependencyLifetime
    ) =>
    {
        this.diScopeBuilder.register
        (
            {
                type: DependencyDescriptorType.FactoryAsync,
                key: this.key,
                factory,
                lifetime
            }
        );

        return this.diScopeBuilder as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyKey, 
                Promise<T_Abstraction>, 
                DependencyDescriptorType.FactoryAsync
            >
        >;
    };

    public readonly asValue = <T_Abstraction>(value: T_Abstraction) =>
    {
        this.diScopeBuilder.register
        (
            {
                type: DependencyDescriptorType.Value,
                key: this.key,
                value,
                lifetime: DependencyLifetime.Singleton
            }
        );

        return this.diScopeBuilder as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyKey, 
                T_Abstraction, 
                DependencyDescriptorType.Value
            >
        >;
    };
    
    public readonly asClass = <T_Abstraction>
    (
        constructor: Constructor<[], T_Abstraction>, 
        lifetime: DependencyLifetime
    ) => 
    {
        this.diScopeBuilder.register
        (
            {
                type: DependencyDescriptorType.Class,
                key: this.key,
                constructor,
                lifetime
            }
        );

        return this.diScopeBuilder as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyKey, 
                T_Abstraction, 
                DependencyDescriptorType.Class
            >
        >;
    };

    public readonly asFactory = <T_Abstraction>
    (
        factory: Delegate<[], T_Abstraction>, 
        lifetime: DependencyLifetime
    ) => 
    {
        this.diScopeBuilder.register
        (
            {
                type: DependencyDescriptorType.Factory,
                key: this.key,
                factory,
                lifetime
            }
        );

        return this.diScopeBuilder as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyKey, 
                T_Abstraction, 
                DependencyDescriptorType.Factory
            >
        >;
    };

    public readonly asDependent = 
    <
        T_Keys extends DependencyKey<T_RegisteredDependencies>[]
    >
        (...keys: T_Keys) =>
    {
        return new DefaultDiDependentMappingBuilder(this.diScopeBuilder, this.key, keys);
    }
}