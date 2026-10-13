import type { DiScope } from "./di-scope";
import type { AllowedDependencyKey } from "../types/allowed-dependency-key";
import type { DependencyMappingKey } from "../types/dependency-mapping-key";
import type { RegisteredDependencies } from "../types/registered-dependencies";
import type { FeatureFlag } from "../types/feature-flag";
import type { RemoveDependenciesCollection } from "../types/utilities/remove-dependencies-collection";
import type { DiMappingBuilder } from "./di-mapping-builder";

export type DiScopeBuilder<T_RegisteredDependencies extends RegisteredDependencies = never> =
{
    /**
     * Allows the DI engine to generate JavaScript at runtime for optimization. Enabled by default.
     * CSP policies or runtime restrictions may block code generation; the engine falls back when it fails.
     * Currently, "auto" follows the enabled default.
     * @param value Whether to allow code generation. Omit the argument to enable it.
     */
    setAllowRuntimeCodeGeneration(value?: FeatureFlag): DiScopeBuilder<T_RegisteredDependencies>;

    /**
     * Allows separate runtime module instances for optimization during buildAsync. Enabled by default.
     * Requires the emitted strategy module to be available to the runtime module loader.
     * If module loading fails, the engine falls back to compilation without isolation.
     * Deno requires read permission for computed local imports. Currently, "auto" follows the enabled default.
     * @param value Whether to allow module isolation. Omit the argument to enable it.
     */
    setAllowRuntimeModuleIsolation(value?: FeatureFlag): DiScopeBuilder<T_RegisteredDependencies>;

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

    /** Builds synchronously. Module isolation is only used by buildAsync. */
    build(): DiScope<T_RegisteredDependencies>;
    /**
     * Builds a scope asynchronously, using module isolation for transient class and factory strategies when enabled.
     * Requires the emitted strategy module to be available at runtime.
     */
    buildAsync(): Promise<DiScope<T_RegisteredDependencies>>;
};
