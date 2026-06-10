import { isSafeReference } from "@svs-tm/system";
import { DiDependenciesRegistry } from "../../abstractions/di-dependencies-registry";
import { DependencyNotRegisteredError } from "../../errors";
import { AllowedDependencyKey, DependencyDescriptor, DependencyResolutionKey } from "../../types";
import { isAsyncDescriptor } from "../../helpers";

export class DefaultDiDependenciesRegistry implements DiDependenciesRegistry
{
    public constructor
    (
        protected readonly descriptors: Map<AllowedDependencyKey, DependencyDescriptor[]>
    )
    {
    }

    public getDescriptors()
    {
        return [...this.descriptors.values().flatMap((descriptors) => descriptors)];
    }

    public resolveDescriptorsByKey(key: DependencyResolutionKey<AllowedDependencyKey>)
    {
        if (Array.isArray(key))
        {
            const [mappingKey] = key;
            const descriptors = this.descriptors.get(mappingKey);

            if (!isSafeReference(descriptors))
                throw new DependencyNotRegisteredError(mappingKey);

            return descriptors;
        }
        else
        {
            const descriptor = this.descriptors.get(key)?.[0];
    
            if (!isSafeReference(descriptor))
                throw new DependencyNotRegisteredError(key);
    
            return descriptor;
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
