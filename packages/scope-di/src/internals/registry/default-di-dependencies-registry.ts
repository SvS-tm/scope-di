import { isSafeReference } from "@svs-tm/system";
import type { DiDependenciesRegistry } from "../../abstractions/di-dependencies-registry";
import { DependencyNotRegisteredError, UnknownDependencyTypeError } from "../../errors";
import { isAsyncDescriptor } from "../../helpers/descriptor-helpers";
import { DependencyDescriptorType, type AllowedDependencyKey, type DependencyDescriptor, type DependencyResolutionKey } from "../../types";
import { DependencyDescriptorsBucket } from "../../types/internals/dependency-descriptors-bucket";
import type { RuntimeDependencyDescriptor } from "../../types/internals/runtime-dependency-descriptor";
import { compileAsyncClassDescriptor } from "../instantiation-strategies/async/class-async/compile-async-class-descriptor";
import { compileAsyncFactoryDescriptor } from "../instantiation-strategies/async/factory-async/compile-async-factory-descriptor";
import { compileClassDescriptor } from "../instantiation-strategies/sync/class/compile-class-descriptor";
import { compileFactoryDescriptor } from "../instantiation-strategies/sync/factory/compile-factory-descriptor";
import { compileValueDescriptor } from "../instantiation-strategies/sync/value/compile-value-descriptor";

export class DefaultDiDependenciesRegistry implements DiDependenciesRegistry
{
    private readonly descriptorsSnapshot: RuntimeDependencyDescriptor[];
    private readonly singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>;
    private readonly collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>;

    public constructor
    (
        registrations: ReadonlyMap<AllowedDependencyKey, DependencyDescriptorsBucket>,
        allowRuntimeCodeGeneration: boolean
    )
    {
        const 
        { 
            collectionRegistrations, 
            singularRegistrations, 
            descriptorsSnapshot 
        } 
            = DefaultDiDependenciesRegistry.compileRegistries
            (
                registrations,
                allowRuntimeCodeGeneration
            );

        this.collectionRegistrations = collectionRegistrations;
        this.singularRegistrations = singularRegistrations;
        this.descriptorsSnapshot = descriptorsSnapshot;
    }

    private static compileRegistries
    (
        registrations: ReadonlyMap<AllowedDependencyKey, DependencyDescriptorsBucket>,
        allowRuntimeCodeGeneration: boolean
    )
    {
        const collectionRegistrations = new Map<AllowedDependencyKey, DependencyDescriptor[]>();
        const singularRegistrations = new Map<AllowedDependencyKey, DependencyDescriptor>();
        const descriptorsSnapshot: DependencyDescriptor[] = [];

        for (const [key, descriptorOrCollection] of registrations)
        {
            if (Array.isArray(descriptorOrCollection))
            {
                collectionRegistrations.set(key, descriptorOrCollection.slice());

                if (descriptorOrCollection.length > 0)
                    singularRegistrations.set(key, descriptorOrCollection[0]);

                for (const descriptor of descriptorOrCollection)
                    descriptorsSnapshot.push(descriptor);
            }
            else
            {
                collectionRegistrations.set(key, [descriptorOrCollection]);
                singularRegistrations.set(key, descriptorOrCollection);
                descriptorsSnapshot.push(descriptorOrCollection);
            }
        }

        for (const descriptor of descriptorsSnapshot)
        {
            this.compileDescriptor
            (
                /**
                 * @note hard casting these, as they are mutated in place eventually, 
                 * here was the most correct place for this cast I guess,
                 * because only {@link DefaultDiDependenciesRegistry.compileRegistries}
                 * knows this detali
                 */
                collectionRegistrations as Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
                singularRegistrations as Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
                descriptor,
                allowRuntimeCodeGeneration
            );
        }

        return {
            collectionRegistrations: collectionRegistrations as Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
            singularRegistrations: singularRegistrations as Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
            descriptorsSnapshot: descriptorsSnapshot as RuntimeDependencyDescriptor[]
        };
    }

    private static compileDescriptor
    (
        collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
        singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
        descriptor: DependencyDescriptor,
        allowRuntimeCodeGeneration: boolean
    )
        : asserts descriptor is RuntimeDependencyDescriptor
    {
        const { key, type } = descriptor;

        switch (descriptor.type)
        {
            case DependencyDescriptorType.Value:
            {
                compileValueDescriptor(descriptor);
                
                return;
            }
            case DependencyDescriptorType.Class:
            {
                compileClassDescriptor
                (
                    collectionRegistrations, 
                    singularRegistrations, 
                    descriptor, 
                    allowRuntimeCodeGeneration
                );
                
                return;
            }
            case DependencyDescriptorType.Factory:
            {
                compileFactoryDescriptor
                (
                    collectionRegistrations,
                    singularRegistrations,
                    descriptor,
                    allowRuntimeCodeGeneration
                );

                return;
            }
            case DependencyDescriptorType.ClassAsync:
            {
                compileAsyncClassDescriptor
                (
                    collectionRegistrations,
                    singularRegistrations,
                    descriptor,
                    allowRuntimeCodeGeneration
                );

                return;
            }
            case DependencyDescriptorType.FactoryAsync:
            {
                compileAsyncFactoryDescriptor
                (
                    collectionRegistrations,
                    singularRegistrations,
                    descriptor,
                    allowRuntimeCodeGeneration
                );

                return;
            }
            default:
                throw new UnknownDependencyTypeError(key, type);
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
