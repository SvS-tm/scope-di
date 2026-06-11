import { ChancyValue, isSafeReference, TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import type { DiScope } from "../../abstractions/di-scope";
import { UnknownDependencyLifetimeError } from "../../errors/unknown-dependency-lifetime-error";
import { UnknownDependencyTypeError } from "../../errors/unknown-dependency-type-error";
import { isAsyncDescriptor } from "../../helpers/descriptor-helpers";
import type { AwaitedResolvedDependencies } from "../../types";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import type { DependencyMappingKey } from "../../types/dependency-mapping-key";
import type { DependencyResolutionKey } from "../../types/dependency-resolution-key";
import type { ScheduleResolutionResult } from "../../types/internals/schedule-resolution-result";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { ResolvedDependencies } from "../../types/utilities/resolved-dependencies";
import type { DefaultDiDependenciesRegistry } from "../registry/default-di-dependencies-registry";

export class DefaultDiScope<T_RegisteredDependencies extends RegisteredDependencies = never> 
    implements DiScope<T_RegisteredDependencies>
{
    private readonly resolvedDependencies = new Map<DependencyDescriptor, unknown | unknown[]>();

    public constructor
    (
        public readonly registry: DefaultDiDependenciesRegistry,
        public readonly root?: DefaultDiScope<T_RegisteredDependencies>,
        public readonly parent?: DefaultDiScope<T_RegisteredDependencies>
    )
    {
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
        return keys.map
        (
            (key) => 
            {
                const descriptorOrCollection = this.registry.resolveDescriptorsByKey(key);

                if (Array.isArray(descriptorOrCollection))
                {
                    return descriptorOrCollection.map((descriptor) => this.resolveByDescriptor(descriptor));
                }
                else
                {
                    return this.resolveByDescriptor(descriptorOrCollection);
                }
            }
        ) as ResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>;
    }

    private scheduleResolution(descriptor: DependencyDescriptor) : ScheduleResolutionResult
    {
        const result = this.resolveByDescriptor(descriptor);
                
        if (isAsyncDescriptor(descriptor))
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
        const descriptors = keys?.map((key) => this.registry.resolveDescriptorsByKey(key));

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
                const subDependenciesKeys = descriptor.subDependenciesKeys ?? [];
                const dependencies = this.resolve(...subDependenciesKeys as DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]);

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
                const subDependenciesKeys = descriptor.subDependenciesKeys ?? [];
                const dependencies = this.resolve(...subDependenciesKeys as DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]);

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

    public findResolvedDependencyByDescriptor(descriptor: DependencyDescriptor): ChancyValue<unknown>
    {
        switch (descriptor.lifetime)
        {
            case DependencyLifetime.Transient:
                return ChancyValue.failure();
            case DependencyLifetime.Singleton:
            {
                if (isSafeReference(this.root))
                    return this.root.findResolvedDependencyByDescriptor(descriptor);

                if (this.resolvedDependencies.has(descriptor))
                    return ChancyValue.success(this.resolvedDependencies.get(descriptor));

                return ChancyValue.failure();
            }
            case DependencyLifetime.Scoped:
            {
                if (this.resolvedDependencies.has(descriptor))
                    return ChancyValue.success(this.resolvedDependencies.get(descriptor));

                return ChancyValue.failure();
            }
            case DependencyLifetime.ScopedInherited:
            {
                for (let current = this.parent; isSafeReference(current); current = current.parent)
                {
                    if (current.resolvedDependencies.has(descriptor))
                        return ChancyValue.success(current.resolvedDependencies.get(descriptor));
                }

                if (this.resolvedDependencies.has(descriptor))
                    return ChancyValue.success(this.resolvedDependencies.get(descriptor));

                return ChancyValue.failure();
            }
            default:
            {
                const unknownDescriptor = descriptor as DependencyDescriptor;

                throw new UnknownDependencyLifetimeError(unknownDescriptor.key, unknownDescriptor.lifetime);
            }
        }
    }

    private resolveByDescriptor(descriptor: DependencyDescriptor): unknown
    {
        const lookupResult = this.findResolvedDependencyByDescriptor(descriptor);

        if (ChancyValue.isSuccess(lookupResult))
            return ChancyValue.get(lookupResult);

        const dependency = this.instantiate(descriptor);
        const owner = descriptor.lifetime === DependencyLifetime.Singleton
            ? this.root ?? this
            : this;

        /**
         * @note special case for Transient, we need to track all values as well,
         * as they might be disposable.
         */
        if (descriptor.lifetime === DependencyLifetime.Transient)
        {
            const dependencies = owner.resolvedDependencies.get(descriptor);

            if (Array.isArray(dependencies))
                dependencies.push(dependency);
            else
                owner.resolvedDependencies.set(descriptor, [dependency]);
        }
        /**
         * @note for other cases - caching as single dependency resolved by descriptor
         */
        else
            owner.resolvedDependencies.set(descriptor, dependency);

        return dependency;
    }

    public createChildScope(): DiScope<T_RegisteredDependencies>
    {
        return new DefaultDiScope(this.registry, this.root ?? this, this);
    }

    private async disposeAsyncDependencies(dependencies: [DependencyDescriptor, unknown][])
    {
        function* generatePromises()
        {
            for (const [descriptor, dependencyOrCollection] of dependencies)
            {
                if (!isSafeReference(dependencyOrCollection))
                    continue;

                async function disposeAsync(dependency: unknown)
                {
                    if (!isAsyncDescriptor(descriptor))
                    {
                        await (dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose]?.();
                        
                        return;
                    }

                    dependency = await dependency;

                    if (isSafeReference((dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose]))
                        await (dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose]?.();
                    else
                        (dependency as Partial<Disposable>)[Symbol.dispose]?.();
                }

                if (descriptor.lifetime === DependencyLifetime.Transient)
                {
                    /**
                     * @note transient dependencies are stored as well, but already as collection.
                     */
                    for (const dependency of dependencyOrCollection as unknown[])
                    {
                        yield disposeAsync(dependency);
                    }
                }
                else
                    yield disposeAsync(dependencyOrCollection);
            }
        }

        const promises = [...generatePromises()];

        await Promise.all(promises);
    }

    private disposeSyncDependencies(dependencies: [DependencyDescriptor, unknown][])
    {
        for (const [descriptor, dependencyOrCollection] of dependencies)
        {
            if (!isSafeReference(dependencyOrCollection) || isAsyncDescriptor(descriptor))
                continue;

            if (descriptor.lifetime === DependencyLifetime.Transient)
            {
                /**
                 * @note transient dependencies are stored as well, but already as collection.
                 */
                for (const dependency of dependencyOrCollection as unknown[])
                {
                    /**
                     * @note if dependency has asyncDispose method - then skip sync disposal, 
                     * as async has more priority and will be executed via async branch
                     */
                    if (!isSafeReference((dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose]))
                        (dependency as Partial<Disposable>)[Symbol.dispose]?.();
                }
            }
            /**
             * @note if dependency has asyncDispose method - then skip sync disposal, 
             * as async has more priority and will be executed via async branch
             */
            else if (!isSafeReference((dependencyOrCollection as Partial<AsyncDisposable>)[Symbol.asyncDispose]))
                (dependencyOrCollection as Partial<Disposable>)[Symbol.dispose]?.();
        }
    }

    public [Symbol.dispose]() 
    {
        const dependencies = [...this.resolvedDependencies.entries()];

        this.disposeAsyncDependencies(dependencies);
        
        this.disposeSyncDependencies(dependencies);
    }

    public async [Symbol.asyncDispose]()
    {
        const dependencies = [...this.resolvedDependencies.entries()];

        const asyncDependenciesDisposal = this.disposeAsyncDependencies(dependencies);

        this.disposeSyncDependencies(dependencies);

        await asyncDependenciesDisposal;
    }
}
