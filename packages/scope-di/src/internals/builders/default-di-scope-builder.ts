import { Logging } from "../../helpers/internals/logging";
import { loadIsolatedTransientStrategyModules } from "./load-isolated-transient-strategy-modules";
import type { DiScopeBuilder } from "../../abstractions";
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

export class DefaultDiScopeBuilder<T_RegisteredDependencies extends RegisteredDependencies = never> 
    implements DiScopeBuilder<T_RegisteredDependencies>
{
    private allowRuntimeCodeGeneration: boolean = true;
    private allowRuntimeModuleIsolation: boolean = true;
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

    public setAllowRuntimeCodeGeneration(value: FeatureFlag = true)
    {
        // Automatic runtime selection is not implemented yet; auto follows the enabled default.
        this.allowRuntimeCodeGeneration = value !== false;

        return this;
    }

    public setAllowRuntimeModuleIsolation(value: FeatureFlag = true)
    {
        this.allowRuntimeModuleIsolation = value !== false;

        return this;
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

        return this as unknown as DiScopeBuilder<RemoveDependenciesCollection<T_RegisteredDependencies, T_DependencyMappingKey>>;
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

    public build()
    {
        const registrations = this.createRegistrations();

        return new DefaultDiScope<T_RegisteredDependencies>
        (
            new DefaultDiDependenciesRegistry
            (
                registrations,
                this.allowRuntimeCodeGeneration
            )
        );
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

    public async buildAsync()
    {
        if (!this.allowRuntimeModuleIsolation)
            return this.build();

        const registrations = this.createRegistrations();
        const descriptors = Array.from(registrations.values()).flat();
        const strategyModules = await this.loadIsolatedStrategies(descriptors);

        return new DefaultDiScope<T_RegisteredDependencies>
        (
            new DefaultDiDependenciesRegistry(registrations, this.allowRuntimeCodeGeneration, strategyModules)
        );
    }
}
