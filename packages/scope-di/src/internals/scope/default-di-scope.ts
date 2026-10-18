import { ChancyValue, isSafeReference, TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import type { DiScope } from "../../abstractions/di-scope";
import { UnknownDependencyLifetimeError } from "../../errors/unknown-dependency-lifetime-error";
import { isAsyncDescriptor } from "../../helpers/descriptor-helpers";
import { createBoxedPromiseDependency } from "../../helpers/internals/boxed-promise-dependency-helper";
import type { AwaitedResolvedDependencies, DependencyDescriptor } from "../../types";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import type { DependencyMappingKey } from "../../types/dependency-mapping-key";
import type { DependencyResolutionKey } from "../../types/dependency-resolution-key";
import { RuntimeDependencyDescriptor } from "../../types/internals/runtime-dependency-descriptor";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { AwaitedResolutionResult } from "../../types/utilities/awaited-resolution-result";
import type { ResolutionResult } from "../../types/utilities/resolution-result";
import type { ResolvedDependencies } from "../../types/utilities/resolved-dependencies";
import type { DefaultDiDependenciesRegistry } from "../registry/default-di-dependencies-registry";

export class DefaultDiScope<T_RegisteredDependencies extends RegisteredDependencies = never> 
    implements DiScope<T_RegisteredDependencies>
{
    /**
     * @note all dependencies that can be looked-up from scope are stored here
     */
    private readonly dependenciesCache = new Map<RuntimeDependencyDescriptor, unknown | unknown[]>();
    
    /**
     * @note Sync transient values that implement only sync disposal.
     */
    private transientDependencies: Disposable[] | undefined;

    /**
     * @note Promises produced by async descriptors. These must be awaited before checking disposal hooks.
     */
    private transientAsyncDependencies: Promise<unknown>[] | undefined;
    
    /**
     * @note Sync transient values that implement async disposal. Do not merge with async dependencies:
     * sync descriptors are allowed to return Promise values, and those promises are dependencies themselves.
     */
    private transientAsyncDisposables: AsyncDisposable[] | undefined;

    public constructor
    (
        public readonly registry: DefaultDiDependenciesRegistry,
        public readonly root?: DefaultDiScope<T_RegisteredDependencies>,
        public readonly parent?: DefaultDiScope<T_RegisteredDependencies>
    )
    {
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
        return this.resolveAsyncDependencyByKey(key) as Promise<AwaitedResolutionResult<T_RegisteredDependencies, T_DependencyResolutionKey, true>>;
    }

    public resolveRange
    <
        const T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
    >
    (
        ...keys: T_DependencyResolutionKeys
    )
    {
        return this.resolveDependencies(keys) as ResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>;
    }

    public resolveRangeAsync
    <
        const T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
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

    private resolveDependencyByKey(key: DependencyResolutionKey<AllowedDependencyKey>)
    {
        if (Array.isArray(key))
        {
            const [mappingKey] = key;

            const descriptorsCollection = this.registry.resolveCollectionDescriptorsByKey(mappingKey);

            const descriptorsLength = descriptorsCollection.length;
            const collection = new Array(descriptorsLength);

            for (let descriptorIndex = 0; descriptorIndex < descriptorsLength; ++descriptorIndex)
                collection[descriptorIndex] = this.resolveByDescriptor(descriptorsCollection[descriptorIndex]);

            return collection;
        }
        else
        {
            const decsriptor = this.registry.resolveSingularDescriptorByKey(key);

            return this.resolveByDescriptor(decsriptor);
        }
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
        if (Array.isArray(key))
        {
            const [mappingKey] = key;
            const descriptorsCollection = this.registry.resolveCollectionDescriptorsByKey(mappingKey);

            const descriptorsLength = descriptorsCollection.length;
            const collection = new Array(descriptorsLength);
            const asyncDependencies: Promise<any>[] = [];

            for (let descriptorIndex = 0; descriptorIndex < descriptorsLength; ++descriptorIndex)
            {
                const descriptor = descriptorsCollection[descriptorIndex];
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
        else
        {
            const descriptor = this.registry.resolveSingularDescriptorByKey(key);
            const value = this.resolveByDescriptor(descriptor);

            if (!isAsyncDescriptor(descriptor))
            {
                if (value instanceof Promise)
                    return TrackedPromise.resolved(createBoxedPromiseDependency(value));

                return TrackedPromise.resolved(value);
            }
            else if (TrackedPromise.isTracked(value) && value[TrackedPromise.status] === TrackedPromiseStatus.Success)
                return TrackedPromise.resolved(value[TrackedPromise.value]);
            else
                return value as Promise<unknown>;
        }
    }

    public resolveAsyncDependencies(keys?: DependencyResolutionKey<AllowedDependencyKey>[])
    {
        if (!isSafeReference(keys))
            return null;

        const asyncDependencies: Promise<any>[] = [];

        const keysLength = keys.length;
        const results: (unknown | unknown[])[] = new Array(keysLength);

        for (let index = 0; index < keysLength; ++index)
        {
            const key = keys[index];

            if (Array.isArray(key))
            {
                const [mappingKey] = key;

                const descriptorsCollection = this.registry.resolveCollectionDescriptorsByKey(mappingKey);

                const descriptorsLength = descriptorsCollection.length;
                const collection = new Array(descriptorsLength);

                for (let descriptorIndex = 0; descriptorIndex < descriptorsLength; ++descriptorIndex)
                {
                    const descriptor = descriptorsCollection[descriptorIndex];

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
                const descriptor = this.registry.resolveSingularDescriptorByKey(key);

                const value = this.resolveByDescriptor(descriptor);

                if (!isAsyncDescriptor(descriptor))
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

    public findResolvedDependencyByDescriptor(descriptor: RuntimeDependencyDescriptor): ChancyValue<unknown>
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

    public resolveByDescriptor(descriptor: RuntimeDependencyDescriptor): unknown
    {
        if (descriptor.lifetime !== DependencyLifetime.Transient)
        {
            const lookupResult = this.findResolvedDependencyByDescriptor(descriptor);

            if (ChancyValue.isSuccess(lookupResult))
                return ChancyValue.get(lookupResult);
        }

        const dependency = descriptor.instatiationStrategy(this);

        const owner = descriptor.lifetime === DependencyLifetime.Singleton
            ? this.root ?? this
            : this;

        /**
         * @note for other cases - caching as single dependency resolved by descriptor
         */
        if (descriptor.lifetime !== DependencyLifetime.Transient)
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

    public addDisposableDependency(dependency: Disposable)
    {
        (this.transientDependencies ??= []).push(dependency);
    }

    public addAsyncDisposableDependency(dependency: AsyncDisposable)
    {
        (this.transientAsyncDisposables ??= []).push(dependency);
    }

    public trackTransientAsyncDependency(promise: Promise<unknown>)
    {
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
    }

    public createChildScope(): DiScope<T_RegisteredDependencies>
    {
        return new DefaultDiScope(this.registry, this.root ?? this, this);
    }

    private async disposeAsyncDependencies(dependencies: [RuntimeDependencyDescriptor, unknown][])
    {
        function *generatePromises()
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

    private async disposeTransientAsyncDependencies()
    {
        if (!isSafeReference(this.transientAsyncDependencies))
            return;

        async function disposeAsync(dependency: unknown)
        {
            dependency = await dependency;

            if (isSafeReference((dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose]))
                await (dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose]?.();
            else
                (dependency as Partial<Disposable>)[Symbol.dispose]?.();
        }

        const promises = new Array(this.transientAsyncDependencies.length);

        for (let index = 0; index < this.transientAsyncDependencies.length; ++index)
            promises[index] = disposeAsync(this.transientAsyncDependencies[index]);

        await Promise.all(promises);
    }

    private async disposeTransientAsyncDisposables()
    {
        if (!isSafeReference(this.transientAsyncDisposables))
            return;

        const promises = new Array(this.transientAsyncDisposables.length);

        for (let index = 0; index < this.transientAsyncDisposables.length; ++index)
            promises[index] = this.transientAsyncDisposables[index][Symbol.asyncDispose]();

        await Promise.all(promises);
    }

    private disposeSyncDependencies(dependencies: [RuntimeDependencyDescriptor, unknown][])
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

    private disposeTransientDependencies()
    {
        if (!isSafeReference(this.transientDependencies))
            return;

        for (const dependency of this.transientDependencies)
            dependency[Symbol.dispose]();
    }

    public [Symbol.dispose]() 
    {
        const dependencies = [...this.dependenciesCache.entries()];

        this.disposeAsyncDependencies(dependencies);
        this.disposeTransientAsyncDependencies();
        this.disposeTransientAsyncDisposables();
        
        this.disposeSyncDependencies(dependencies);
        this.disposeTransientDependencies();
    }

    public async [Symbol.asyncDispose]()
    {
        const dependencies = [...this.dependenciesCache.entries()];

        const asyncDependenciesDisposal = this.disposeAsyncDependencies(dependencies);
        const transientAsyncDependenciesDisposal = this.disposeTransientAsyncDependencies();
        const transientAsyncDisposablesDisposal = this.disposeTransientAsyncDisposables();

        this.disposeSyncDependencies(dependencies);
        this.disposeTransientDependencies();

        await asyncDependenciesDisposal;
        await transientAsyncDependenciesDisposal;
        await transientAsyncDisposablesDisposal;
    }
}
