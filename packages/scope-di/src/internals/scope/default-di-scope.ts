import { Enumerable, isSafeReference, TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
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
import { DependencyResolutionTraceResult } from "../../types/internals/dependency-resolution-trace-result";
import { AsyncDependencyDescriptor } from "../../types/async-dependency-descriptor";

type ScheduleResolutionResult = 
{ 
    isReady: boolean; 
    value: unknown; 
};

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

    private findResolvedDependency(descriptor: DependencyDescriptor): unknown | null
    {
        switch(descriptor.lifetime)
        {
            case DependencyLifetime.Transient:
                return null;
            case DependencyLifetime.Singleton:
                return (this.root ?? this).resolvedDependencies.get(descriptor) ?? null;
            case DependencyLifetime.Scoped:
                return this.resolvedDependencies.get(descriptor) ?? null;
            case DependencyLifetime.ScopedInherited:
            {
                return (
                    this.resolvedDependencies.has(descriptor)
                        ? this.resolvedDependencies.get(descriptor)
                        : this.parent?.findResolvedDependency(descriptor)
                ) 
                    ?? null;
            }
        }
    }

    private traceDescriptorResolution(descriptor: DependencyDescriptor): DependencyResolutionTraceResult
    {
        if (this.isAsyncDependency(descriptor))
        {
            const resolvedValue = this.findResolvedDependency(descriptor);

            if (isSafeReference(resolvedValue))
            {
                if (resolvedValue instanceof Promise)
                {
                    const trackedPromise = TrackedPromise.track(resolvedValue);

                    switch (trackedPromise[TrackedPromise.status])
                    {
                        case TrackedPromiseStatus.Success:
                            return DependencyResolutionTraceResult.AsyncSettled;
                        default:
                            /**
                             * @note If Promise is in pendig or error state, we'll mark it as async
                             * (so we won't polute everything with errors when its not needed)
                             */
                            return DependencyResolutionTraceResult.Async;
                    }
                }
                /**
                 * @note It could be PromiseLike? I guess no, but anyway lets guard here
                 */
                else
                    return DependencyResolutionTraceResult.Async;
            }
            /**
             * @note in case it is class async, and we don't have any cached promise
             * we'll need to traverse dependencies tree recursively, as it might be that 
             * all dependencies are AsyncSettled or Sync, then this one will be considered as
             * AsyncSettled as well 
             * (as constructors itself can't have async logic)
             */
            else if (descriptor.type === DependencyDescriptorType.ClassAsync)
            {
                const dependenciesKeys = descriptor.subDependenciesKeys;

                if (!isSafeReference(dependenciesKeys))
                    return DependencyResolutionTraceResult.Sync;

                return this.traceResolution(...dependenciesKeys as DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]);   
            }
            /**
             * @note If it is Async dependency and it wasn't found in cache, 
             * then we'll need to recurse in subDependencies
             */
            else
            {
                return DependencyResolutionTraceResult.Async;
            }
        }
        /**
         * @note If it is not an async dependency, then its Sync by default
         */
        else
            return DependencyResolutionTraceResult.Sync;
    }

    public traceResolution<T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_DependencyResolutionKeys
    )
        : DependencyResolutionTraceResult
    {
        return Enumerable
            .fromFactory(() => this.resolveDescriptorsFlat(...keys))
            .aggregate<DependencyResolutionTraceResult>
            (
                DependencyResolutionTraceResult.Sync,
                (aggregated, descriptor) =>
                {
                    const result = this.traceDescriptorResolution(descriptor);

                    if (result === DependencyResolutionTraceResult.Async)
                        return Enumerable.terminateAggregation(result);
                    else if (result > aggregated)
                        return result;
                    else
                        return aggregated;
                }
            );
    }

    public resolveAsync
    <
        T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
    >
    (
        ...keys: T_DependencyResolutionKeys
    )
    {
        const promise = this.resolveAsyncDependencies(keys);

        if (isSafeReference(promise))
        {
            if (promise[TrackedPromise.status] === TrackedPromiseStatus.Success)
                return TrackedPromise.resolved((promise[TrackedPromise.value] ?? []) as AwaitedResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>);
            else
                return promise.then((result) => (result ?? []) as AwaitedResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>);
        }

        return TrackedPromise.resolved([] as AwaitedResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>);
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

    private isAsyncDependency(descriptor: DependencyDescriptor): descriptor is AsyncDependencyDescriptor
    {
        return (
            descriptor.type === DependencyDescriptorType.ClassAsync 
                || 
            descriptor.type === DependencyDescriptorType.FactoryAsync
        );
    }

    private scheduleResolution(descriptor: DependencyDescriptor) : ScheduleResolutionResult
    {
        const result = this.resolveByDescriptor(descriptor);
                
        if (this.isAsyncDependency(descriptor))
        {
            /**
             * @note in case it was tracked promise and it was already resolved - we'll go with sync path
             */
            if (TrackedPromise.isTracked(result) && result[TrackedPromise.status] === TrackedPromiseStatus.Success)
            {
                return { isReady: true, value: result[TrackedPromise.value] };
            }
            else
            {
                return { isReady: false, value: result };
            }
        }
        else
            return { isReady: true, value: result };
    }

    private resolveAsyncDependencies(keys?: DependencyResolutionKey<AllowedDependencyKey>[])
    {
        const descriptors = keys?.map((key) => this.resolveDescriptors(key));

        if (!isSafeReference(descriptors))
            return null;

        const asyncDependencies: Promise<any>[] = [];

        const results: (unknown | unknown[])[] = new Array(descriptors.length);

        for (let index = 0; index < results.length; ++index)
        {
            const descriptorOrCollection = descriptors[index];

            if (Array.isArray(descriptorOrCollection))
            {
                const collection = new Array(descriptorOrCollection.length);

                for (let index = 0; index < descriptorOrCollection.length; ++index)
                {
                    const descriptor = descriptorOrCollection[index];

                    const { isReady, value } = this.scheduleResolution(descriptor);

                    if (isReady)
                    {
                        collection[index] = value;
                    }
                    else
                    {
                        const awaitAndSetDependency = async () => 
                            void (collection[index] = await value);

                        asyncDependencies.push(awaitAndSetDependency());
                    }
                }

                results[index] = collection;
            }
            else
            {
                const { isReady, value } = this.scheduleResolution(descriptorOrCollection);

                if (isReady)
                {
                    results[index] = value;
                }
                else
                {
                    const awaitAndSetDependency = async () => 
                        void (results[index] = await value);

                    asyncDependencies.push(awaitAndSetDependency());
                }
            }
        }

        if (asyncDependencies.length > 0)
            return TrackedPromise.track(Promise.all(asyncDependencies).then(() => results));

        return TrackedPromise.resolved(results);
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
                const promise = this.resolveAsyncDependencies(descriptor.subDependenciesKeys);

                if (isSafeReference(promise))
                {
                    if (promise[TrackedPromise.status] !== TrackedPromiseStatus.Success)
                    {
                        const resolveAsync = async () =>
                        {
                            const dependencies = await promise;
    
                            return isSafeReference(dependencies)
                                ? await new descriptor.constructor(...dependencies)
                                : await new descriptor.constructor();
                        };
    
                        return TrackedPromise.track(resolveAsync());
                    }

                    /**
                     * @note Class constructor can't have async work, so we can safely wrap it in resolved tracked promise here
                     */
                    return TrackedPromise.resolved(new descriptor.constructor(...promise[TrackedPromise.value]));
                }

                /**
                 * @note Class constructor can't have async work, so we can safely wrap it in resolved tracked promise here
                 */
                return TrackedPromise.resolved(new descriptor.constructor());
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
                const promise = this.resolveAsyncDependencies(descriptor.subDependenciesKeys);

                if (isSafeReference(promise))
                {
                    if (promise[TrackedPromise.status] !== TrackedPromiseStatus.Success)
                    {
                        const resolveAsync = async () =>
                        {
                            const dependencies = await promise;
    
                            return isSafeReference(dependencies)
                                ? await descriptor.factory(...dependencies)
                                : await descriptor.factory();
                        };
    
                        return TrackedPromise.track(resolveAsync());
                    }

                    /**
                     * @note factory can have async work, so we can't reliably say if promise was resolved already or no...
                     * So lets just track it
                     */
                    return TrackedPromise.track(descriptor.factory(...promise[TrackedPromise.value]));
                }

                /**
                 * @note factory can have async work, so we can't reliably say if promise was resolved already or no...
                 * So lets just track it
                 */
                return TrackedPromise.track(descriptor.factory());
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

    private *resolveDescriptorsFlat(...keys: DependencyResolutionKey<AllowedDependencyKey>[])
    {
        if (!isSafeReference(keys) || !keys.length)
            return;

        for (const key of keys)
        {
            const descriptorOrCollection = this.resolveDescriptors(key);

            if (Array.isArray(descriptorOrCollection))
                yield *descriptorOrCollection;
            else
                yield descriptorOrCollection;
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
