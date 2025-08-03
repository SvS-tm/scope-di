import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { AvailableDependencyKey } from "../../types/available-dependency-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { DiMappingBuilder } from "./di-mapping-builder";
import type { DependencyKey } from "../../types/dependency-key";
import type { RemoveDependency } from "../../types/utilities/remove-dependency";
import type { DiScope } from "../../scope/abstractions/di-scope";

export type DiScopeBuilder
<
    T_RegisteredDependencies extends RegisteredDependencies = {}
> =
{
    map<T_DependencyKey extends AllowedDependencyKey>
    (
        key: AvailableDependencyKey<T_DependencyKey, T_RegisteredDependencies>
    )
        : DiMappingBuilder<T_RegisteredDependencies, T_DependencyKey>;

    removeMapping
    <
        T_DependencyKey extends DependencyKey<T_RegisteredDependencies>
    >
    (
        key: T_DependencyKey
    )
        : DiScopeBuilder<
            RemoveDependency<
                T_RegisteredDependencies, 
                T_DependencyKey
            >
        >;
    
    hasMapping<T_Key extends AllowedDependencyKey>(key: T_Key): boolean;

    build(): DiScope<T_RegisteredDependencies>;
};
