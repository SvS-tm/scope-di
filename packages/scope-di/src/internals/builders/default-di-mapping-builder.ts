import type { Constructor, Delegate } from "@svs-tm/system";
import type { DependencyFactory, DependencyResolutionKey } from "../../types";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import type { DependencyMappingKey } from "../../types/dependency-mapping-key";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { AddDependency } from "../../types/utilities/add-dependency";
import type { DiMappingBuilder, DiScopeBuilder } from "../../abstractions";
import { DefaultDiDependentMappingBuilder } from "./default-di-dependent-mapping-builder";
import { DefaultDiScopeBuilder } from "./default-di-scope-builder";

export class DefaultDiMappingBuilder
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyMappingKey extends AllowedDependencyKey 
>
    implements DiMappingBuilder<T_RegisteredDependencies, T_DependencyMappingKey>
{
    public constructor
    (
        private readonly diScopeBuilder: DefaultDiScopeBuilder<T_RegisteredDependencies>,
        private readonly key: T_DependencyMappingKey
    )
    {
    }

    public readonly asClassAsync = <T_Abstraction>
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

        return this.diScopeBuilder as unknown as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
                Promise<T_Abstraction>, 
                DependencyDescriptorType.ClassAsync
            >
        >;
    };

    public readonly asFactoryAsync = <T_Abstraction>
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

        return this.diScopeBuilder as unknown as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
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

        return this.diScopeBuilder as unknown as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
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

        return this.diScopeBuilder as unknown as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
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

        return this.diScopeBuilder as unknown as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
                T_Abstraction, 
                DependencyDescriptorType.Factory
            >
        >;
    };

    public readonly asDependent = 
    <
        T_Keys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
    >
        (...keys: T_Keys) =>
    {
        return new DefaultDiDependentMappingBuilder(this.diScopeBuilder, this.key, keys);
    }
}
