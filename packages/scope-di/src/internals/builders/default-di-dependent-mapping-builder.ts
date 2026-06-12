import type { Constructor, Delegate } from "@svs-tm/system";
import type { DiDependentMappingBuilder } from "../../abstractions/di-dependent-mapping-builder";
import type { DiScopeBuilder } from "../../abstractions/di-scope-builder";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import type { DependencyFactory } from "../../types/dependency-factory";
import type { DependencyLifetime } from "../../types/dependency-lifetime";
import type { DependencyMappingKey } from "../../types/dependency-mapping-key";
import type { DependencyResolutionKey } from "../../types/dependency-resolution-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { AddDependency } from "../../types/utilities/add-dependency";
import type { AwaitedResolvedDependencies } from "../../types/utilities/awaited-resolved-dependencies";
import type { ResolvedDependencies } from "../../types/utilities/resolved-dependencies";
import { DefaultDiScopeBuilder } from "./default-di-scope-builder";

export class DefaultDiDependentMappingBuilder
<
    T_DependencyMappingKey extends AllowedDependencyKey,
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Keys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
>
    implements DiDependentMappingBuilder<T_DependencyMappingKey, T_RegisteredDependencies, T_Keys>
{
    public constructor
    (
        private readonly diScopeBuilder: DefaultDiScopeBuilder<T_RegisteredDependencies>,
        private readonly key: T_DependencyMappingKey,
        private readonly subDependenciesKeys: T_Keys
    )
    {
    }

    public readonly class = <T_Abstraction>
    (
        constructor: Constructor<
            ResolvedDependencies<T_RegisteredDependencies, T_Keys>, 
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

        return this.diScopeBuilder as unknown as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
                T_Abstraction, 
                DependencyDescriptorType.Class
            >
        >;
    }
    public readonly factory = <T_Abstraction>
    (
        factory: Delegate<
            ResolvedDependencies<T_RegisteredDependencies, T_Keys>, 
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

        return this.diScopeBuilder as unknown as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
                T_Abstraction, 
                DependencyDescriptorType.Factory
            >
        >;
    };

    public readonly classAsync = <T_Abstraction>
    (
        constructor: Constructor<
            AwaitedResolvedDependencies<T_RegisteredDependencies, T_Keys>,
            T_Abstraction
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

        return this.diScopeBuilder as unknown as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
                Promise<T_Abstraction>, 
                DependencyDescriptorType.ClassAsync
            >
        >;
    };

    public readonly factoryAsync = <T_Abstraction>
    (
        factory: DependencyFactory<
            AwaitedResolvedDependencies<T_RegisteredDependencies, T_Keys>,
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

        return this.diScopeBuilder as unknown as DiScopeBuilder<
            AddDependency<
                T_RegisteredDependencies, 
                T_DependencyMappingKey, 
                Promise<T_Abstraction>, 
                DependencyDescriptorType.FactoryAsync
            >
        >;
    }
}
