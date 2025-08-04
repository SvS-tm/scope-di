import type { DiScope } from "../../scope/abstractions/di-scope";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyKey } from "../../types/dependency-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { RemoveDependenciesCollection } from "../../types/utilities/remove-dependencies-collection";
import type { DiMappingBuilder } from "./di-mapping-builder";

export type DiScopeBuilder<T_RegisteredDependencies extends RegisteredDependencies = never> =
{
    map<T_DependencyKey extends AllowedDependencyKey>
    (
        key: T_DependencyKey
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
            RemoveDependenciesCollection<
                T_RegisteredDependencies, 
                T_DependencyKey
            >
        >;
    
    hasMapping<T_Key extends AllowedDependencyKey>(key: T_Key): boolean;

    build(): DiScope<T_RegisteredDependencies>;
};
