import type { AllowedDependencyKey } from "../types/allowed-dependency-key";
import type { DependencyMappingKey } from "../types/dependency-mapping-key";
import { DiFeatures } from "../types/di-features";
import { DiScopeBuildingResult } from "../types/di-scope-building-result";
import type { FeatureFlag } from "../types/feature-flag";
import type { RegisteredDependencies } from "../types/registered-dependencies";
import type { RemoveDependenciesCollection } from "../types/utilities/remove-dependencies-collection";
import { SetFeature } from "../types/utilities/set-feature";
import type { DiMappingBuilder } from "./di-mapping-builder";

export type DiScopeBuilder
<
    T_RegisteredDependencies extends RegisteredDependencies = never, 
    T_Features extends DiFeatures = DiFeatures<false, false>
> 
    =
{
    /**
     * Allows the DI engine to generate JavaScript at runtime for optimization. Disabled by default.
     * CSP policies or runtime restrictions may block generation; the engine warns and falls back.
     * "auto" allows the runtime policy to choose whether to enable generation.
     * Continue configuration using the returned builder reference.
     * @param value true to enable, false to disable, or "auto" to use the automatic policy.
     */
    setAllowRuntimeCodeGeneration<const T_FeatureFlag extends FeatureFlag>
    (
        value: T_FeatureFlag
    )
        : DiScopeBuilder<
            T_RegisteredDependencies, 
            SetFeature<T_Features, "allowRuntimeCodeGeneration", T_FeatureFlag>
        >;

    /**
     * Allows separate runtime module instances for optimization. Disabled by default.
     * Selecting true or "auto" makes build return a Promise, even if loading fails and isolation is skipped.
     * "auto" allows the runtime policy to choose isolation, but build always returns a Promise in this mode.
     * Requires the emitted chunks to be available. Deno needs read permission for computed local imports;
     * browsers must serve the chunks and allow their URLs through CSP and CORS where applicable.
     * If loading fails, the engine warns and compiles without isolation.
     * Continue configuration using the returned builder reference.
     * @param value true to enable, false to disable, or "auto" to use the automatic policy.
     */
    setAllowRuntimeModuleIsolation<const T_FeatureFlag extends FeatureFlag>
    (
        value: T_FeatureFlag
    )
        : DiScopeBuilder<
            T_RegisteredDependencies, 
            SetFeature<T_Features, "allowRuntimeModuleIsolation", T_FeatureFlag>
        >;

    map<T_DependencyMappingKey extends AllowedDependencyKey>
    (
        key: T_DependencyMappingKey
    )
        : DiMappingBuilder<T_RegisteredDependencies, T_Features, T_DependencyMappingKey>;

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
            >,
            T_Features
        >;
    
    hasMapping<T_DependencyMappingKey extends AllowedDependencyKey>(key: T_DependencyMappingKey): boolean;

    /**
     * Builds synchronously by default. Returns a Promise when module isolation is true or "auto".
     * An isolation flag whose value is not known statically produces a scope-or-Promise return type.
     */
    build(): DiScopeBuildingResult<T_RegisteredDependencies, T_Features>;
};
