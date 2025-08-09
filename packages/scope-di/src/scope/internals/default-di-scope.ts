import { isNotSafeReference, isSafeReference } from "@svs-tm/system";
import { isDependenciesCollectionResolutionKey } from "../../helpers/internals/is-dependencies-collection-resolution-key";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import type { DependencyMappingKey } from "../../types/dependency-mapping-key";
import type { DependencyResolutionKey } from "../../types/dependency-resolution-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { InjectionResult } from "../../types/utilities/injection-result";
import type { DiScope } from "../abstractions";
import { DependencyNotRegisteredError } from "../errors/dependency-not-registered-error";
import { UnknownDependencyLifetimeError } from "../errors/unknown-dependency-lifetime-error";
import { UnknownDependencyTypeError } from "../errors/unknown-dependency-type-error";

export class DefaultDiScope<T_RegisteredDependencies extends RegisteredDependencies = never> 
    implements DiScope<T_RegisteredDependencies>
{
    private readonly resolvedDependencies = new Map<DependencyDescriptor, unknown>();

    public constructor
    (
        private readonly registry: Map<AllowedDependencyKey, DependencyDescriptor[]>,
        private readonly root?: DefaultDiScope<T_RegisteredDependencies>,
        private readonly parent?: DefaultDiScope<T_RegisteredDependencies>,
    )
    {
    }

    private readonly isAsyncDependency = ({ type }: DependencyDescriptor) => 
    (
        type === DependencyDescriptorType.ClassAsync 
            || 
        type === DependencyDescriptorType.FactoryAsync
    );

    private readonly resolveAsyncSubDependencies = async (keys?: DependencyResolutionKey<AllowedDependencyKey>[]) =>
    {
        const descriptors = keys?.map((key) => this.resolveDescriptors(key));

        if (isNotSafeReference(descriptors))
            return null;

        const asyncDependencies: Promise<any>[] = [];

        const results: (unknown | unknown[])[] = Array.from({ length: descriptors.length });

        for (let index = 0; index < results.length; ++index)
        {
            const descriptorOrCollection = descriptors[index];

            if (Array.isArray(descriptorOrCollection))
            {
                const collection = Array.from({ length: descriptorOrCollection.length });

                for (let index = 0; index < descriptorOrCollection.length; ++index)
                {
                    const descriptor = descriptorOrCollection[index];

                    const result = this.resolveByDescriptor(descriptor);
                    
                    if (this.isAsyncDependency(descriptor))
                    {
                        const awaitAndSetDependency = async () => 
                            void (collection[index] = await result);

                        asyncDependencies.push(awaitAndSetDependency());
                    }
                    else
                        collection[index] = result;
                }

                results[index] = collection;
            }
            else
            {
                const result = this.resolveByDescriptor(descriptorOrCollection);

                if (this.isAsyncDependency(descriptorOrCollection))
                {
                    const awaitAndSetDependency = async () => 
                        void (results[index] = await result);

                    asyncDependencies.push(awaitAndSetDependency());
                }
                else
                {
                    results[index] = result;
                }
            }
        }

        if (asyncDependencies.length > 0)
            await Promise.all(asyncDependencies);

        return results;
    };

    private readonly instantiate = (descriptor: DependencyDescriptor) =>
    {
        switch (descriptor.type)
        {
            case DependencyDescriptorType.Value:
                return descriptor.value;
            case DependencyDescriptorType.Class:
            {
                const dependencies = descriptor.subDependenciesKeys?.map
                (
                    (key) => this.resolve(key as DependencyMappingKey<T_RegisteredDependencies>)
                );

                return isSafeReference(dependencies) 
                    ? new descriptor.constructor(...dependencies)
                    : new descriptor.constructor();
            }
            case DependencyDescriptorType.ClassAsync:
            {
                const resolveAsync = async () =>
                {
                    const dependencies = await this.resolveAsyncSubDependencies(descriptor.subDependenciesKeys);

                    return isSafeReference(dependencies) 
                        ? await new descriptor.constructor(...dependencies)
                        : await new descriptor.constructor();
                };

                return resolveAsync();
            }
            case DependencyDescriptorType.Factory:
            {
                const dependencies = descriptor.subDependenciesKeys?.map
                (
                    (key) => this.resolve(key as DependencyMappingKey<T_RegisteredDependencies>)
                );

                return isSafeReference(dependencies) 
                    ? descriptor.factory(...dependencies)
                    : descriptor.factory();
            }
            case DependencyDescriptorType.FactoryAsync:
            {
                const resolveAsync = async () =>
                {
                    const dependencies = await this.resolveAsyncSubDependencies(descriptor.subDependenciesKeys);

                    return isSafeReference(dependencies) 
                        ? await descriptor.factory(...dependencies)
                        : await descriptor.factory();
                };

                return resolveAsync();
            }
            default:
            {
                const unknownDescriptor = descriptor as DependencyDescriptor;

                throw new UnknownDependencyTypeError(unknownDescriptor.key, unknownDescriptor.type);
            }
        }
    };

    private readonly resolveDescriptors = (key: DependencyResolutionKey<AllowedDependencyKey>) =>
    {
        if (isDependenciesCollectionResolutionKey(key))
        {
            const descriptors = this.registry.get(key.mappingKey);

            if (isNotSafeReference(descriptors))
                throw new DependencyNotRegisteredError(key.mappingKey);

            return descriptors;
        }
        else
        {
            const descriptor = this.registry.get(key)?.[0];
    
            if (isNotSafeReference(descriptor))
                throw new DependencyNotRegisteredError(key);
    
            return descriptor;
        }
    };

    private readonly resolveFromCurrentScope = (descriptor: DependencyDescriptor) =>
    {
        if (this.resolvedDependencies.has(descriptor))
            return this.resolvedDependencies.get(descriptor);

        const dependency = this.instantiate(descriptor);

        this.resolvedDependencies.set(descriptor, dependency);

        return dependency;
    };

    private readonly getHierarchy = function* (this: DefaultDiScope<T_RegisteredDependencies>)
    {
        for (let current = this.parent; isSafeReference(current); current = current.parent)
            yield current;
    };

    private readonly resolveFromScopeHierarchy = (descriptor: DependencyDescriptor) =>
    {
        const hierarchyScope = [...this.getHierarchy()]
            .findLast(({ resolvedDependencies }) => resolvedDependencies.has(descriptor));

        if (isSafeReference(hierarchyScope))
            return hierarchyScope.resolvedDependencies.get(descriptor);

        return this.resolveFromCurrentScope(descriptor);
    }

    private readonly resolveByDescriptor = (descriptor: DependencyDescriptor): unknown =>
    {
        switch (descriptor.lifetime)
        {
            case DependencyLifetime.Transient:
                return this.instantiate(descriptor);
            case DependencyLifetime.Singleton:
            {
                if (isSafeReference(this.root))
                    return this.root.resolveByDescriptor(descriptor);

                return this.resolveFromCurrentScope(descriptor);
            }
            case DependencyLifetime.Scoped:
                return this.resolveFromCurrentScope(descriptor);
            case DependencyLifetime.ScopedInherited:
                return this.resolveFromScopeHierarchy(descriptor);
            default:
            {
                const unknownDescriptor = descriptor as DependencyDescriptor;

                throw new UnknownDependencyLifetimeError(unknownDescriptor.key, unknownDescriptor.lifetime);
            }
        }
    };

    public readonly resolve = 
    <
        T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>
    >
    (
        key: DependencyResolutionKey<T_DependencyMappingKey>
    )
        : InjectionResult<T_RegisteredDependencies, DependencyResolutionKey<T_DependencyMappingKey>> =>
    {
        const descriptorOrCollection = this.resolveDescriptors(key);

        if (Array.isArray(descriptorOrCollection))
        {
            return descriptorOrCollection.map((descriptor) => this.resolveByDescriptor(descriptor)) as
                InjectionResult<T_RegisteredDependencies, DependencyResolutionKey<T_DependencyMappingKey>>;
        }
        else
        {
            return this.resolveByDescriptor(descriptorOrCollection) as 
                InjectionResult<T_RegisteredDependencies, DependencyResolutionKey<T_DependencyMappingKey>>;
        }
    };

    public readonly getDescriptors = (): readonly Readonly<DependencyDescriptor>[] => 
    {
        return [...this.registry.values().map(([descriptor]) => descriptor)];
    };

    public readonly createChildScope = (): DiScope<T_RegisteredDependencies> => 
    {
        return new DefaultDiScope(this.registry, this.root ?? this, this);
    };

    private readonly disposeAsyncDependencies = async (dependencies: unknown[]) =>
    {
        await Promise.all
        (
            dependencies.map
            (
                (dependency) => isSafeReference(dependency)
                    ? (dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose]?.() 
                    : undefined
            )
        );
    };

    private readonly disposeSyncDependencies = (dependencies: unknown[]) =>
    {
        for (const dependency of dependencies)
        {
            if 
            (
                isNotSafeReference(dependency) 
                    || 
                isSafeReference((dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose])
            )
                continue;

            (dependency as Partial<Disposable>)[Symbol.dispose]?.();
        }
    };

    public readonly [Symbol.dispose] = () => 
    {
        const dependencies = [...this.resolvedDependencies.values()];

        this.disposeAsyncDependencies(dependencies);
        
        this.disposeSyncDependencies(dependencies);
    };

    public readonly [Symbol.asyncDispose] = async () => 
    {
        const dependencies = [...this.resolvedDependencies.values()];

        const asyncDependenciesDisposal = this.disposeAsyncDependencies(dependencies);

        this.disposeSyncDependencies(dependencies);

        await asyncDependenciesDisposal;
    };
}
