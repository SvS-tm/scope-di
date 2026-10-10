import { isSafeReference } from "@svs-tm/system";
import type { DiDependenciesRegistry } from "../../abstractions/di-dependencies-registry";
import { DependencyNotRegisteredError } from "../../errors";
import { isAsyncDescriptor } from "../../helpers/descriptor-helpers";
import type { AllowedDependencyKey, DependencyDescriptor, DependencyResolutionKey } from "../../types";
import type { DependencyDescriptorsBucket } from "../../types/internals/dependency-descriptors-bucket";

export class DefaultDiDependenciesRegistry implements DiDependenciesRegistry
{
    private readonly descriptorsSnapshot: DependencyDescriptor[] = [];
    private readonly singularRegistrations = new Map<AllowedDependencyKey, DependencyDescriptor>();
    private readonly collectionRegistrations = new Map<AllowedDependencyKey, DependencyDescriptor[]>();

    public constructor
    (
        registrations: ReadonlyMap<AllowedDependencyKey, DependencyDescriptorsBucket>
    )
    {
        for (const [key, descriptorOrCollection] of registrations)
        {
            if (Array.isArray(descriptorOrCollection))
            {
                this.collectionRegistrations.set(key, descriptorOrCollection.slice());

                if (descriptorOrCollection.length > 0)
                    this.singularRegistrations.set(key, descriptorOrCollection[0]);

                for (const descriptor of descriptorOrCollection)
                    this.descriptorsSnapshot.push(descriptor);
            }
            else
            {
                this.collectionRegistrations.set(key, [descriptorOrCollection]);
                this.singularRegistrations.set(key, descriptorOrCollection);
                this.descriptorsSnapshot.push(descriptorOrCollection);
            }
        }
    }

    public getDescriptors()
    {
        return this.descriptorsSnapshot.slice();
    }

    public resolveCollectionDescriptorsByKey(mappingKey: AllowedDependencyKey)
    {
        const collection = this.collectionRegistrations.get(mappingKey);

        if (!isSafeReference(collection))
            throw new DependencyNotRegisteredError(mappingKey);

        return collection;
    }

    public resolveSingularDescriptorByKey(mappingKey: AllowedDependencyKey)
    {
        const singularDescriptor = this.singularRegistrations.get(mappingKey);

        if (isSafeReference(singularDescriptor))
            return singularDescriptor;
        
        const [firstCollectionDescriptor] = this.resolveCollectionDescriptorsByKey(mappingKey);

        return firstCollectionDescriptor;
    }

    /**
     * @deprecated Use {@link resolveCollectionDescriptorsByKey} or {@link resolveSingularDescriptorByKey} instead.
     */
    public resolveDescriptorsByKey(key: DependencyResolutionKey<AllowedDependencyKey>)
    {
        if (Array.isArray(key))
        {
            const [mappingKey] = key;
            
            return this.resolveCollectionDescriptorsByKey(mappingKey);
        }
        else
            return this.resolveSingularDescriptorByKey(key);
    }

    public *resolveDescriptorsByKeys(...keys: DependencyResolutionKey<AllowedDependencyKey>[])
    {
        if (!isSafeReference(keys) || !keys.length)
            return;

        for (const key of keys)
        {
            if (Array.isArray(key))
                yield *this.resolveCollectionDescriptorsByKey(...key);
            else
                yield this.resolveSingularDescriptorByKey(key);
        }
    }

    public isAsyncKey(key: DependencyResolutionKey<AllowedDependencyKey>)
    {
        if (Array.isArray(key))
        {
            const [mappingKey] = key;

            const descriptors = this.resolveCollectionDescriptorsByKey(mappingKey);

            return descriptors.some((descriptor) => isAsyncDescriptor(descriptor));
        }
        else
        {
            const singularDescriptor = this.resolveSingularDescriptorByKey(key);

            return isAsyncDescriptor(singularDescriptor);
        }
    }
}
