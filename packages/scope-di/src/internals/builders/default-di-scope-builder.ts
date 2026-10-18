import { Logging } from "../../helpers/internals/logging";
import { loadIsolatedTransientStrategyModules } from "./load-isolated-transient-strategy-modules";
import type { DiScope, DiScopeBuilder } from "../../abstractions";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import type { DependencyMappingKey } from "../../types/dependency-mapping-key";
import type { DependencyDescriptorsBucket } from "../../types/internals/dependency-descriptors-bucket";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { FeatureFlag } from "../../types/feature-flag";
import type { RemoveDependenciesCollection } from "../../types/utilities/remove-dependencies-collection";
import { DefaultDiDependenciesRegistry } from "../registry/default-di-dependencies-registry";
import { DefaultDiScope } from "../scope/default-di-scope";
import { DefaultDiMappingBuilder } from "./default-di-mapping-builder";
import { SetFeature } from "../../types/utilities/set-feature";
import { DiFeatures } from "../../types/di-features";
import { DiScopeBuildingResult } from "../../types/di-scope-building-result";

export class DefaultDiScopeBuilder
<
    T_RegisteredDependencies extends RegisteredDependencies = never, 
    T_Features extends DiFeatures = DiFeatures<false, false>
> 
    implements DiScopeBuilder<T_RegisteredDependencies, T_Features>
{
    private allowRuntimeCodeGeneration = false;
    private allowRuntimeModuleIsolation = false;
    private readonly descriptors = new Map<AllowedDependencyKey, DependencyDescriptorsBucket>();

    /**
     * @internal This is internal method, its not safe to use it.
     */
    public register(descriptor: DependencyDescriptor)
    {
        const descriptorOrCollection = this.descriptors.get(descriptor.key);

        if(!descriptorOrCollection)
            this.descriptors.set(descriptor.key, descriptor);
        else if(Array.isArray(descriptorOrCollection))
            descriptorOrCollection.unshift(descriptor);
        else
            this.descriptors.set(descriptor.key, [descriptor, descriptorOrCollection]);
    }

    public setAllowRuntimeCodeGeneration<const T_FeatureFlag extends FeatureFlag>(value: T_FeatureFlag)
    {
        // Runtime selection is not implemented yet. Explicit auto currently enables generation;
        // leaving the setter unused keeps the feature disabled.
        this.allowRuntimeCodeGeneration = value !== false;

        return this as unknown as DiScopeBuilder<
            T_RegisteredDependencies, 
            SetFeature<T_Features, "allowRuntimeCodeGeneration", T_FeatureFlag>
        >;
    }

    public setAllowRuntimeModuleIsolation<const T_FeatureFlag extends FeatureFlag>(value: T_FeatureFlag)
    {
        // Explicit auto currently enables isolation. Its build contract stays asynchronous even
        // when a future runtime policy skips isolation, so callers can always await the result.
        this.allowRuntimeModuleIsolation = value !== false;

        return this as unknown as DiScopeBuilder<
            T_RegisteredDependencies, 
            SetFeature<T_Features, "allowRuntimeModuleIsolation", T_FeatureFlag>
        >;
    }

    public map<T_DependencyMappingKey extends AllowedDependencyKey>(key: T_DependencyMappingKey)
    {
        return new DefaultDiMappingBuilder(this, key);
    }

    public removeMapping<T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
    (
        key: T_DependencyMappingKey
    )
    {
        this.descriptors.delete(key);

        return this as unknown as DiScopeBuilder<RemoveDependenciesCollection<T_RegisteredDependencies, T_DependencyMappingKey>, T_Features>;
    }

    public hasMapping<T_DependencyMappingKey extends AllowedDependencyKey>(key: T_DependencyMappingKey)
    {
        return this.descriptors.has(key);
    }

    private createRegistrations()
    {
        const registrations = new Map<AllowedDependencyKey, DependencyDescriptorsBucket>();

        // Compiling shared descriptors again would rebind strategies already owned by earlier scopes.
        for (const [key, descriptorOrCollection] of this.descriptors)
        {
            registrations.set
            (
                key,
                Array.isArray(descriptorOrCollection)
                    ? descriptorOrCollection.map(descriptor => ({ ...descriptor }))
                    : { ...descriptorOrCollection }
            );
        }

        return registrations;
    }

    private async loadIsolatedStrategies(descriptors: Iterable<DependencyDescriptor>)
    {
        try
        {
            return await loadIsolatedTransientStrategyModules(descriptors);
        }
        catch (error)
        {
            // Missing chunks, loader restrictions, or denied imports can prevent module isolation.
            // Compile without isolated modules instead; enabled code generation can still be selected,
            // otherwise predefined strategies retain transient tracking. Keep compilation outside this
            // catch so invalid registrations are reported rather than treated as loading failures.
            Logging.warning("Module isolation failed; continuing without isolation.", error);

            return undefined;
        }
    }

    private async buildAsync(registrations: Map<string, DependencyDescriptorsBucket>)
    {
        const descriptors = Array.from(registrations.values()).flat();
        const strategyModules = await this.loadIsolatedStrategies(descriptors);

        return new DefaultDiScope<T_RegisteredDependencies>
        (
            new DefaultDiDependenciesRegistry(registrations, this.allowRuntimeCodeGeneration, strategyModules)
        );
    }

    public build(): DiScopeBuildingResult<T_RegisteredDependencies, T_Features>;
    public build(): DiScope<T_RegisteredDependencies> | Promise<DiScope<T_RegisteredDependencies>>
    {
        const registrations = this.createRegistrations();

        if (this.allowRuntimeModuleIsolation)
            return this.buildAsync(registrations);
        
        return new DefaultDiScope<T_RegisteredDependencies>
        (
            new DefaultDiDependenciesRegistry(registrations, this.allowRuntimeCodeGeneration)
        );
    }
}
