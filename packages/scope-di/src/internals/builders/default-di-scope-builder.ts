import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import type { DependencyMappingKey } from "../../types/dependency-mapping-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { DependencyDescriptorsBucket } from "../../types/internals/dependency-descriptors-bucket";
import type { RemoveDependenciesCollection } from "../../types/utilities/remove-dependencies-collection";
import type { DiScopeBuilder } from "../../abstractions";
import { DefaultDiMappingBuilder } from "./default-di-mapping-builder";
import { DefaultDiScope } from "../scope/default-di-scope";
import { DefaultDiDependenciesRegistry } from "../registry/default-di-dependencies-registry";

export class DefaultDiScopeBuilder<T_RegisteredDependencies extends RegisteredDependencies = never> 
    implements DiScopeBuilder<T_RegisteredDependencies>
{
    private readonly descriptors = new Map<AllowedDependencyKey, DependencyDescriptorsBucket>();

    /**
     * @internal This is internal method, its not safe to use it.
     */
    public register(descriptor: DependencyDescriptor)
    {
        const descriptorOrCollection = this.descriptors.get(descriptor.key);

        if(!descriptorOrCollection)
        {
            this.descriptors.set(descriptor.key, descriptor);
        }
        else if(Array.isArray(descriptorOrCollection))
        {
            descriptorOrCollection.unshift(descriptor);
        }
        else
        {
            this.descriptors.set(descriptor.key, [descriptor, descriptorOrCollection]);
        }
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

    public build()
    {
        const descriptorsSnapshot = new Map<AllowedDependencyKey, DependencyDescriptorsBucket>();

        for(const [key, descriptorOrCollection] of this.descriptors)
        {
            descriptorsSnapshot.set
            (
                key,
                Array.isArray(descriptorOrCollection)
                    ? descriptorOrCollection.slice()
                    : descriptorOrCollection
            );
        }

        return new DefaultDiScope<T_RegisteredDependencies>(new DefaultDiDependenciesRegistry(descriptorsSnapshot));
    }
}
