import type { DiScope } from "./di-scope";
import type { AllowedDependencyKey } from "../types/allowed-dependency-key";
import type { DependencyMappingKey } from "../types/dependency-mapping-key";
import type { RegisteredDependencies } from "../types/registered-dependencies";
import type { RemoveDependenciesCollection } from "../types/utilities/remove-dependencies-collection";
import type { DiMappingBuilder } from "./di-mapping-builder";

export type DiScopeBuilder<T_RegisteredDependencies extends RegisteredDependencies = never> =
{
    /**
     * Allows the DI engine to generate JavaScript at runtime for optimization. Disabled by default.
     * CSP policies or runtime restrictions may block code generation; the engine falls back when it fails.
     * @param value Whether to allow code generation. Omit the argument to enable it.
     */
    setAllowRuntimeCodeGeneration(value?: boolean): DiScopeBuilder<T_RegisteredDependencies>;

    map<T_DependencyMappingKey extends AllowedDependencyKey>
    (
        key: T_DependencyMappingKey
    )
        : DiMappingBuilder<T_RegisteredDependencies, T_DependencyMappingKey>;

    removeMapping
    <
        T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>
    >
    (
        key: T_DependencyMappingKey
    )
        : DiScopeBuilder<
            RemoveDependenciesCollection<
                T_RegisteredDependencies, 
                T_DependencyMappingKey
            >
        >;
    
    hasMapping<T_DependencyMappingKey extends AllowedDependencyKey>(key: T_DependencyMappingKey): boolean;

    build(): DiScope<T_RegisteredDependencies>;
};
