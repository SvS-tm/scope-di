import { isSafeReference } from "@svs-tm/system";
import { DiDependenciesRegistry } from "../../abstractions/di-dependencies-registry";
import { DependencyNotRegisteredError } from "../../errors";
import { AllowedDependencyKey, DependencyDescriptor, DependencyResolutionKey } from "../../types";
import type { DependencyDescriptorsBucket } from "../../types/internals/dependency-descriptors-bucket";
import { isAsyncDescriptor } from "../../helpers/descriptor-helpers";

export class DefaultDiDependenciesRegistry implements DiDependenciesRegistry
{
    public constructor
    (
        protected readonly descriptors: Map<AllowedDependencyKey, DependencyDescriptorsBucket>
    )
    {
    }

    public getDescriptors()
    {
        const result: DependencyDescriptor[] = [];

        for(const descriptorOrCollection of this.descriptors.values())
        {
            if(Array.isArray(descriptorOrCollection))
            {
                result.push(...descriptorOrCollection);
            }
            else
            {
                result.push(descriptorOrCollection);
            }
        }

        return result;
    }

    public resolveDescriptorsByKey(key: DependencyResolutionKey<AllowedDependencyKey>)
    {
        if (Array.isArray(key))
        {
            const [mappingKey] = key;
            const descriptorOrCollection = this.descriptors.get(mappingKey);

            if (!isSafeReference(descriptorOrCollection))
                throw new DependencyNotRegisteredError(mappingKey);

            if(Array.isArray(descriptorOrCollection))
                return descriptorOrCollection;

            const collection = [descriptorOrCollection];
            this.descriptors.set(mappingKey, collection);

            return collection;
        }
        else
        {
            const descriptorOrCollection = this.descriptors.get(key);
    
            if (!isSafeReference(descriptorOrCollection))
                throw new DependencyNotRegisteredError(key);
    
            return Array.isArray(descriptorOrCollection)
                ? descriptorOrCollection[0]
                : descriptorOrCollection;
        }
    }

    public *resolveDescriptorsByKeys(...keys: DependencyResolutionKey<AllowedDependencyKey>[])
    {
        if (!isSafeReference(keys) || !keys.length)
            return;

        for (const key of keys)
        {
            const descriptorOrCollection = this.resolveDescriptorsByKey(key);

            if (Array.isArray(descriptorOrCollection))
                yield *descriptorOrCollection;
            else
                yield descriptorOrCollection;
        }
    }

    public isAsyncKey(key: DependencyResolutionKey<AllowedDependencyKey>)
    {
        const descriptorOrCollection = this.resolveDescriptorsByKey(key);

        if (Array.isArray(descriptorOrCollection))
            return descriptorOrCollection.some((descriptor) => isAsyncDescriptor(descriptor));
        else
            return isAsyncDescriptor(descriptorOrCollection);
    }
}
