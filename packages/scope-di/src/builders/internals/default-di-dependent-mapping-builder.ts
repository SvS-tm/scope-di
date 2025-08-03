import type { Constructor, Delegate, Promised } from "@svs-tm/system";
import type { DiDependentMappingBuilder } from "../abstractions/di-dependent-mapping-builder";
import type { DiScopeBuilder } from "../abstractions/di-scope-builder";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import type { DependencyFactory } from "../../types/dependency-factory";
import type { DependencyKey } from "../../types/dependency-key";
import type { DependencyLifetime } from "../../types/dependency-lifetime";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { AddDependency } from "../../types/utilities/add-dependency";
import type { AwaitedInjectedDependencies } from "../../types/utilities/awaited-injected-dependencies";
import type { InjectedDependencies } from "../../types/utilities/injcted-dependencies";
import type { DefaultDiScopeBuilder } from "./default-di-scope-builder";

export class DefaultDiDependentMappingBuilder
<
    T_DependencyKey extends AllowedDependencyKey,
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Keys extends DependencyKey<T_RegisteredDependencies>[]
>
    implements DiDependentMappingBuilder<T_DependencyKey, T_RegisteredDependencies, T_Keys>
{
    public constructor
    (
        private readonly diScopeBuilder: DefaultDiScopeBuilder<T_RegisteredDependencies>,
        private readonly key: T_DependencyKey,
        private readonly subDependenciesKeys: T_Keys
    )
    {
    }

    public readonly class = <T_Abstraction>
    (
        constructor: Constructor<
            InjectedDependencies<T_RegisteredDependencies, T_Keys>, 
            T_Abstraction
        >, 
        lifetime: DependencyLifetime
    ) => 
    {
        this.diScopeBuilder.register
        (
            {
                type: DependencyDescriptorType.Class,
                key: this.key,
                constructor,
                lifetime,
                subDependenciesKeys: this.subDependenciesKeys
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
    }
    public readonly factory = <T_Abstraction>
    (
        factory: Delegate<
            InjectedDependencies<T_RegisteredDependencies, T_Keys>, 
            T_Abstraction
        >, 
        lifetime: DependencyLifetime
    ) => 
    {
        this.diScopeBuilder.register
        (
            {
                type: DependencyDescriptorType.Factory,
                key: this.key,
                factory,
                lifetime,
                subDependenciesKeys: this.subDependenciesKeys
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

    public readonly classAsync = <T_Abstraction>
    (
        constructor: Constructor<
            AwaitedInjectedDependencies<T_RegisteredDependencies, T_Keys>,
            Promised<T_Abstraction>
        >, 
        lifetime: DependencyLifetime
    ) => 
    {
        this.diScopeBuilder.register
        (
            {
                type: DependencyDescriptorType.ClassAsync,
                key: this.key,
                constructor,
                lifetime,
                subDependenciesKeys: this.subDependenciesKeys
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
        factory: DependencyFactory<
            AwaitedInjectedDependencies<T_RegisteredDependencies, T_Keys>,
            Promise<T_Abstraction>
        >, 
        lifetime: DependencyLifetime
    ) =>
    {
        this.diScopeBuilder.register
        (
            {
                type: DependencyDescriptorType.FactoryAsync,
                key: this.key,
                factory,
                lifetime,
                subDependenciesKeys: this.subDependenciesKeys
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
    }
}
