import { isSafeReference } from "@svs-tm/system";
import type { DiScope } from "../../abstractions/di-scope";
import { DependencyNotRegisteredError } from "../../errors/dependency-not-registered-error";
import { UnknownDependencyLifetimeError } from "../../errors/unknown-dependency-lifetime-error";
import { UnknownDependencyTypeError } from "../../errors/unknown-dependency-type-error";
import type { AwaitedResolvedDependencies } from "../../types";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import type { DependencyMappingKey } from "../../types/dependency-mapping-key";
import type { DependencyResolutionKey } from "../../types/dependency-resolution-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { ResolutionResult } from "../../types/utilities/resolution-result";
import type { ResolvedDependencies } from "../../types/utilities/resolved-dependencies";

export class DefaultDiScope<T_RegisteredDependencies extends RegisteredDependencies = never> 
    implements DiScope<T_RegisteredDependencies>
{
    private readonly resolvedDependencies = new Map<DependencyDescriptor, unknown>();

    public constructor
    (
        private readonly registry: Map<AllowedDependencyKey, DependencyDescriptor[]>,
        private readonly root?: DefaultDiScope<T_RegisteredDependencies>,
        private readonly parent?: DefaultDiScope<T_RegisteredDependencies>
    )
    {
    }

    public async resolveAsync
    <
        T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
    >
    (
        ...keys: T_DependencyResolutionKeys
    )
    {
        const dependencies = await this.resolveAsyncDependencies(keys);

        return (dependencies ?? []) as AwaitedResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>;
    }

    public resolve
    <
        T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
    >
    (
        ...keys: T_DependencyResolutionKeys
    )
    {
        return keys.map((key) => this.resolveSingleDependency(key)) as ResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>;
    }

    private isAsyncDependency({ type }: DependencyDescriptor)
    {
        return (
            type === DependencyDescriptorType.ClassAsync 
                || 
            type === DependencyDescriptorType.FactoryAsync
        );
    }

    private async resolveAsyncDependencies(keys?: DependencyResolutionKey<AllowedDependencyKey>[])
    {
        const descriptors = keys?.map((key) => this.resolveDescriptors(key));

        if (!isSafeReference(descriptors))
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
    }

    private instantiate(descriptor: DependencyDescriptor)
    {
        switch (descriptor.type)
        {
            case DependencyDescriptorType.Value:
                return descriptor.value;
            case DependencyDescriptorType.Class:
            {
                const dependencies = descriptor.subDependenciesKeys?.map
                (
                    (key) => this.resolveSingleDependency(key as DependencyMappingKey<T_RegisteredDependencies>)
                );

                return isSafeReference(dependencies) 
                    ? new descriptor.constructor(...dependencies)
                    : new descriptor.constructor();
            }
            case DependencyDescriptorType.ClassAsync:
            {
                const resolveAsync = async () =>
                {
                    const dependencies = await this.resolveAsyncDependencies(descriptor.subDependenciesKeys);

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
                    (key) => this.resolveSingleDependency(key as DependencyMappingKey<T_RegisteredDependencies>)
                );

                return isSafeReference(dependencies) 
                    ? descriptor.factory(...dependencies)
                    : descriptor.factory();
            }
            case DependencyDescriptorType.FactoryAsync:
            {
                const resolveAsync = async () =>
                {
                    const dependencies = await this.resolveAsyncDependencies(descriptor.subDependenciesKeys);

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
    }

    private resolveDescriptors(key: DependencyResolutionKey<AllowedDependencyKey>)
    {
        if (Array.isArray(key))
        {
            const [mappingKey] = key;
            const descriptors = this.registry.get(mappingKey);

            if (!isSafeReference(descriptors))
                throw new DependencyNotRegisteredError(mappingKey);

            return descriptors;
        }
        else
        {
            const descriptor = this.registry.get(key)?.[0];
    
            if (!isSafeReference(descriptor))
                throw new DependencyNotRegisteredError(key);
    
            return descriptor;
        }
    }

    private resolveFromCurrentScope(descriptor: DependencyDescriptor)
    {
        if (this.resolvedDependencies.has(descriptor))
            return this.resolvedDependencies.get(descriptor);

        const dependency = this.instantiate(descriptor);

        this.resolvedDependencies.set(descriptor, dependency);

        return dependency;
    }

    private resolveFromScopeHierarchy(descriptor: DependencyDescriptor)
    {
        for (let current = this.parent; isSafeReference(current); current = current.parent)
        {
            if (current.resolvedDependencies.has(descriptor))
                return current.resolvedDependencies.get(descriptor);
        }

        return this.resolveFromCurrentScope(descriptor);
    }

    private resolveByDescriptor(descriptor: DependencyDescriptor): unknown
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
    }

    private resolveSingleDependency
    <
        T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>
    >
    (
        key: DependencyResolutionKey<T_DependencyMappingKey>
    )
        : ResolutionResult<T_RegisteredDependencies, DependencyResolutionKey<T_DependencyMappingKey>>
    {
        const descriptorOrCollection = this.resolveDescriptors(key);

        if (Array.isArray(descriptorOrCollection))
        {
            return descriptorOrCollection.map((descriptor) => this.resolveByDescriptor(descriptor)) as
                ResolutionResult<T_RegisteredDependencies, DependencyResolutionKey<T_DependencyMappingKey>>;
        }
        else
        {
            return this.resolveByDescriptor(descriptorOrCollection) as 
                ResolutionResult<T_RegisteredDependencies, DependencyResolutionKey<T_DependencyMappingKey>>;
        }
    }

    public getDescriptors(): readonly Readonly<DependencyDescriptor>[]
    {
        return [...this.registry.values().flatMap((descriptors) => descriptors)];
    }

    public createChildScope(): DiScope<T_RegisteredDependencies>
    {
        return new DefaultDiScope(this.registry, this.root ?? this, this);
    }

    private async disposeAsyncDependencies(dependencies: unknown[])
    {
        const promises = dependencies.map
        (
            (dependency) => isSafeReference(dependency)
                ? (dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose]?.() 
                : undefined
        );

        await Promise.all(promises);
    }

    private disposeSyncDependencies(dependencies: unknown[])
    {
        for (const dependency of dependencies)
        {
            if 
            (
                !isSafeReference(dependency) 
                    || 
                isSafeReference((dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose])
            )
                continue;

            (dependency as Partial<Disposable>)[Symbol.dispose]?.();
        }
    }

    public [Symbol.dispose]() 
    {
        const dependencies = [...this.resolvedDependencies.values()];

        this.disposeAsyncDependencies(dependencies);
        
        this.disposeSyncDependencies(dependencies);
    }

    public async [Symbol.asyncDispose]()
    {
        const dependencies = [...this.resolvedDependencies.values()];

        const asyncDependenciesDisposal = this.disposeAsyncDependencies(dependencies);

        this.disposeSyncDependencies(dependencies);

        await asyncDependenciesDisposal;
    }
}
