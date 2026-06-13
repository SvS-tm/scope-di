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
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { AwaitedResolutionResult } from "../../types/utilities/awaited-resolution-result";
import type { ResolutionResult } from "../../types/utilities/resolution-result";
import type { ResolvedDependencies } from "../../types/utilities/resolved-dependencies";
import type { DefaultDiDependenciesRegistry } from "../registry/default-di-dependencies-registry";

export class DefaultDiScope<T_RegisteredDependencies extends RegisteredDependencies = never> 
    implements DiScope<T_RegisteredDependencies>
{
    private readonly dependenciesCache = new Map<DependencyDescriptor, unknown | unknown[]>();
    private transientDependencies: Disposable[] | undefined;
    private transientAsyncDependencies: Promise<unknown>[] | undefined;

    public constructor
    (
        public readonly registry: DefaultDiDependenciesRegistry,
        public readonly root?: DefaultDiScope<T_RegisteredDependencies>,
        public readonly parent?: DefaultDiScope<T_RegisteredDependencies>
    )
    {
    }

    public resolveRangeAsync
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
        T_DependencyResolutionKey extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>
    >
    (
        key: T_DependencyResolutionKey
    )
    {
        return this.resolveDependencyByKey(key) as ResolutionResult<T_RegisteredDependencies, T_DependencyResolutionKey>;
    }

    public resolveAsync
    <
        T_DependencyResolutionKey extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>
    >
    (
        key: T_DependencyResolutionKey
    )
    {
        return this.resolveAsyncDependencyByKey(key) as Promise<AwaitedResolutionResult<T_RegisteredDependencies, T_DependencyResolutionKey>>;
    }

    public resolveRange
    <
        T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
    >
    (
        ...keys: T_DependencyResolutionKeys
    )
    {
        return this.resolveDependencies(keys) as ResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>;
    }

    private resolveDependencyByKey(key: DependencyResolutionKey<AllowedDependencyKey>)
    {
        const descriptorOrCollection = this.registry.resolveDescriptorsByKey(key);

        if (Array.isArray(descriptorOrCollection))
        {
            const descriptorsLength = descriptorOrCollection.length;
            const collection = new Array(descriptorsLength);

            for (let descriptorIndex = 0; descriptorIndex < descriptorsLength; ++descriptorIndex)
                collection[descriptorIndex] = this.resolveByDescriptor(descriptorOrCollection[descriptorIndex]);

            return collection;
        }

        return this.resolveByDescriptor(descriptorOrCollection);
    }

    private resolveDependencies(keys: ArrayLike<DependencyResolutionKey<AllowedDependencyKey>>)
    {
        const keysLength = keys.length;
        
        const results = new Array(keysLength);

        for (let index = 0; index < keysLength; ++index)
        {
            const key = keys[index];
            results[index] = this.resolveDependencyByKey(key);
        }

        return results;
    }

    private resolveAsyncDependencyByKey(key: DependencyResolutionKey<AllowedDependencyKey>)
    {
        const descriptorOrCollection = this.registry.resolveDescriptorsByKey(key);

        if (Array.isArray(descriptorOrCollection))
        {
            const descriptorsLength = descriptorOrCollection.length;
            const collection = new Array(descriptorsLength);
            const asyncDependencies: Promise<any>[] = [];

            for (let descriptorIndex = 0; descriptorIndex < descriptorsLength; ++descriptorIndex)
            {
                const descriptor = descriptorOrCollection[descriptorIndex];
                const value = this.resolveByDescriptor(descriptor);

                if (!isAsyncDescriptor(descriptor))
                    collection[descriptorIndex] = value;
                else if (TrackedPromise.isTracked(value) && value[TrackedPromise.status] === TrackedPromiseStatus.Success)
                    collection[descriptorIndex] = value[TrackedPromise.value];
                else
                {
                    const awaitAndSetDependency = async () => 
                        void (collection[descriptorIndex] = await value);

                    asyncDependencies.push(awaitAndSetDependency());
                }
            }

            if (asyncDependencies.length > 0)
                return TrackedPromise.track(Promise.all(asyncDependencies).then(() => collection));

            return TrackedPromise.resolved(collection);
        }

        const value = this.resolveByDescriptor(descriptorOrCollection);

        if (!isAsyncDescriptor(descriptorOrCollection))
            return TrackedPromise.resolved(value);
        else if (TrackedPromise.isTracked(value) && value[TrackedPromise.status] === TrackedPromiseStatus.Success)
            return TrackedPromise.resolved(value[TrackedPromise.value]);
        else
            return value as Promise<unknown>;
    }

    private resolveAsyncDependencies(keys?: DependencyResolutionKey<AllowedDependencyKey>[])
    {
        if (!isSafeReference(keys))
            return null;

        const asyncDependencies: Promise<any>[] = [];

        const keysLength = keys.length;
        const results: (unknown | unknown[])[] = new Array(keysLength);

        for (let index = 0; index < keysLength; ++index)
        {
            const descriptorOrCollection = this.registry.resolveDescriptorsByKey(keys[index]);

            if (Array.isArray(descriptorOrCollection))
            {
                const descriptorsLength = descriptorOrCollection.length;
                const collection = new Array(descriptorsLength);

                for (let descriptorIndex = 0; descriptorIndex < descriptorsLength; ++descriptorIndex)
                {
                    const descriptor = descriptorOrCollection[descriptorIndex];

                    const value = this.resolveByDescriptor(descriptor);

                    if (!isAsyncDescriptor(descriptor))
                        collection[descriptorIndex] = value;
                    else if (TrackedPromise.isTracked(value) && value[TrackedPromise.status] === TrackedPromiseStatus.Success)
                        collection[descriptorIndex] = value[TrackedPromise.value];
                    else
                    {
                        const awaitAndSetDependency = async () => 
                            void (collection[descriptorIndex] = await value);

                        asyncDependencies.push(awaitAndSetDependency());
                    }
                }

                results[index] = collection;
            }
            else
            {
                const value = this.resolveByDescriptor(descriptorOrCollection);

                if (!isAsyncDescriptor(descriptorOrCollection))
                    results[index] = value;
                else if (TrackedPromise.isTracked(value) && value[TrackedPromise.status] === TrackedPromiseStatus.Success)
                    results[index] = value[TrackedPromise.value];
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
                const subDependenciesKeys = descriptor.subDependenciesKeys;

                if (!isSafeReference(subDependenciesKeys) || subDependenciesKeys.length === 0)
                    return new descriptor.constructor();

                const dependencies = this.resolveDependencies(subDependenciesKeys as DependencyResolutionKey<AllowedDependencyKey>[]);

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
                const subDependenciesKeys = descriptor.subDependenciesKeys;

                if (!isSafeReference(subDependenciesKeys) || subDependenciesKeys.length === 0)
                    return descriptor.factory();

                const dependencies = this.resolveDependencies(subDependenciesKeys as DependencyResolutionKey<AllowedDependencyKey>[]);

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

                if (this.dependenciesCache.has(descriptor))
                    return ChancyValue.success(this.dependenciesCache.get(descriptor));

                return ChancyValue.failure();
            }
            case DependencyLifetime.Scoped:
            {
                if (this.dependenciesCache.has(descriptor))
                    return ChancyValue.success(this.dependenciesCache.get(descriptor));

                return ChancyValue.failure();
            }
            case DependencyLifetime.ScopedInherited:
            {
                for (let current = this.parent; isSafeReference(current); current = current.parent)
                {
                    if (current.dependenciesCache.has(descriptor))
                        return ChancyValue.success(current.dependenciesCache.get(descriptor));
                }

                if (this.dependenciesCache.has(descriptor))
                    return ChancyValue.success(this.dependenciesCache.get(descriptor));

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
        if (descriptor.lifetime !== DependencyLifetime.Transient)
        {
            const lookupResult = this.findResolvedDependencyByDescriptor(descriptor);

            if (ChancyValue.isSuccess(lookupResult))
                return ChancyValue.get(lookupResult);
        }

        const dependency = this.instantiate(descriptor);

        const owner = descriptor.lifetime === DependencyLifetime.Singleton
            ? this.root ?? this
            : this;

        if (descriptor.lifetime === DependencyLifetime.Transient)
            owner.trackTransientDependency(descriptor, dependency);
        /**
         * @note for other cases - caching as single dependency resolved by descriptor
         */
        else
            owner.dependenciesCache.set(descriptor, dependency);

        if (descriptor.lifetime !== DependencyLifetime.Transient && isAsyncDescriptor(descriptor) && dependency instanceof Promise)
        {
            dependency.catch
            (
                () =>
                {
                    if (owner.dependenciesCache.get(descriptor) === dependency)
                        owner.dependenciesCache.delete(descriptor);
                }
            );
        }

        return dependency;
    }

    private trackTransientDependency(descriptor: DependencyDescriptor, dependency: unknown)
    {
        if (isAsyncDescriptor(descriptor))
        {
            const promise = dependency as Promise<unknown>;

            (this.transientAsyncDependencies ??= []).push(promise);

            promise.catch
            (
                () =>
                {
                    const dependencies = this.transientAsyncDependencies;

                    if (!isSafeReference(dependencies))
                        return;

                    const index = dependencies.indexOf(promise);

                    if (index >= 0)
                        dependencies.splice(index, 1);

                    if (dependencies.length === 0)
                        this.transientAsyncDependencies = undefined;
                }
            );

            return;
        }

        if (isSafeReference((dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose]))
            (this.transientAsyncDependencies ??= []).push(dependency);
        else if (isSafeReference((dependency as Partial<Disposable>)[Symbol.dispose]))
            (this.transientDependencies ??= []).push(dependency as Disposable);
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

                yield disposeAsync(dependencyOrCollection);
            }
        }

        const promises = [...generatePromises()];

        await Promise.all(promises);
    }

    private async disposeTransientAsyncDependencies(dependencies?: Promise<unknown>[])
    {
        if (!isSafeReference(dependencies))
            return;

        async function disposeAsync(dependency: unknown)
        {
            dependency = await dependency;

            if (isSafeReference((dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose]))
                await (dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose]?.();
            else
                (dependency as Partial<Disposable>)[Symbol.dispose]?.();
        }

        const promises = new Array(dependencies.length);

        for (let index = 0; index < dependencies.length; ++index)
            promises[index] = disposeAsync(dependencies[index]);

        await Promise.all(promises);
    }

    private disposeSyncDependencies(dependencies: [DependencyDescriptor, unknown][])
    {
        for (const [descriptor, dependencyOrCollection] of dependencies)
        {
            if (!isSafeReference(dependencyOrCollection) || isAsyncDescriptor(descriptor))
                continue;

            /**
             * @note if dependency has asyncDispose method - then skip sync disposal, 
             * as async has more priority and will be executed via async branch
             */
            if (!isSafeReference((dependencyOrCollection as Partial<AsyncDisposable>)[Symbol.asyncDispose]))
                (dependencyOrCollection as Partial<Disposable>)[Symbol.dispose]?.();
        }
    }

    private disposeTransientDependencies(dependencies?: Disposable[])
    {
        if (!isSafeReference(dependencies))
            return;

        for (const dependency of dependencies)
            dependency[Symbol.dispose]();
    }

    public [Symbol.dispose]() 
    {
        const dependencies = [...this.dependenciesCache.entries()];

        this.disposeAsyncDependencies(dependencies);
        this.disposeTransientAsyncDependencies(this.transientAsyncDependencies);
        
        this.disposeSyncDependencies(dependencies);
        this.disposeTransientDependencies(this.transientDependencies);
    }

    public async [Symbol.asyncDispose]()
    {
        const dependencies = [...this.dependenciesCache.entries()];

        const asyncDependenciesDisposal = this.disposeAsyncDependencies(dependencies);
        const transientAsyncDependenciesDisposal = this.disposeTransientAsyncDependencies(this.transientAsyncDependencies);

        this.disposeSyncDependencies(dependencies);
        this.disposeTransientDependencies(this.transientDependencies);

        await asyncDependenciesDisposal;
        await transientAsyncDependenciesDisposal;
    }
}
