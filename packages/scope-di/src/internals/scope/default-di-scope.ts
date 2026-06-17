import { ChancyValue, isSafeReference, TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import type { DiScope } from "../../abstractions/di-scope";
import { UnknownDependencyLifetimeError } from "../../errors/unknown-dependency-lifetime-error";
import { UnknownDependencyTypeError } from "../../errors/unknown-dependency-type-error";
import { isAsyncDescriptor } from "../../helpers/descriptor-helpers";
import { createBoxedPromiseDependency } from "../../helpers/internals/boxed-promise-dependency-helper";
import type { AwaitedResolvedDependencies } from "../../types";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { AsyncClassDependencyDescriptor } from "../../types/async-class-dependency-descriptor";
import type { AsyncFactoryDependencyDescriptor } from "../../types/async-factory-dependency-descriptor";
import type { ClassDependencyDescriptor } from "../../types/class-dependency-descriptor";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import type { DependencyMappingKey } from "../../types/dependency-mapping-key";
import type { DependencyResolutionKey } from "../../types/dependency-resolution-key";
import type { FactoryDependencyDescriptor } from "../../types/factory-dependency-descriptor";
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
    private readonly dependenciesCache = new Map<DependencyDescriptor, unknown | unknown[]>();
    
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
        T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
    >
    (
        ...keys: T_DependencyResolutionKeys
    )
    {
        return this.resolveDependencies(keys) as ResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>;
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
                return this.instantiateClass(descriptor);

            case DependencyDescriptorType.ClassAsync:
                return this.instantiateAsyncClass(descriptor);

            case DependencyDescriptorType.Factory:
                return this.instantiateFactory(descriptor);

            case DependencyDescriptorType.FactoryAsync:
                return this.instantiateAsyncFactory(descriptor);

            default:
            {
                const unknownDescriptor = descriptor as DependencyDescriptor;

                throw new UnknownDependencyTypeError(unknownDescriptor.key, unknownDescriptor.type);
            }
        }
    }

    private instantiateClass(descriptor: ClassDependencyDescriptor<unknown>)
    {
        const subDependenciesKeys = descriptor.subDependenciesKeys;

        if (!isSafeReference(subDependenciesKeys) || subDependenciesKeys.length === 0)
            return new descriptor.constructor();

        switch (subDependenciesKeys.length)
        {
            case 1:
            {
                return new descriptor.constructor
                (
                    this.resolveDependencyByKey(subDependenciesKeys[0])
                );
            }
            case 2:
            {
                return new descriptor.constructor
                (
                    this.resolveDependencyByKey(subDependenciesKeys[0]),
                    this.resolveDependencyByKey(subDependenciesKeys[1])
                );
            }
            case 3:
            {
                return new descriptor.constructor
                (
                    this.resolveDependencyByKey(subDependenciesKeys[0]),
                    this.resolveDependencyByKey(subDependenciesKeys[1]),
                    this.resolveDependencyByKey(subDependenciesKeys[2])
                );
            }
            case 4:
            {
                return new descriptor.constructor
                (
                    this.resolveDependencyByKey(subDependenciesKeys[0]),
                    this.resolveDependencyByKey(subDependenciesKeys[1]),
                    this.resolveDependencyByKey(subDependenciesKeys[2]),
                    this.resolveDependencyByKey(subDependenciesKeys[3])
                );
            }
            case 5:
            {
                return new descriptor.constructor
                (
                    this.resolveDependencyByKey(subDependenciesKeys[0]),
                    this.resolveDependencyByKey(subDependenciesKeys[1]),
                    this.resolveDependencyByKey(subDependenciesKeys[2]),
                    this.resolveDependencyByKey(subDependenciesKeys[3]),
                    this.resolveDependencyByKey(subDependenciesKeys[4])
                );
            }
        }

        const dependencies = this.resolveDependencies(subDependenciesKeys);

        return isSafeReference(dependencies)
            ? new descriptor.constructor(...dependencies)
            : new descriptor.constructor();
    }

    private instantiateAsyncClass(descriptor: AsyncClassDependencyDescriptor<unknown>)
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
                        ? await this.instantiateClassWithResolvedDependencies(descriptor, dependencies)
                        : await new descriptor.constructor();
                };

                return TrackedPromise.track(resolveAsync());
            }

            /**
             * @note Class constructor can't have async work, so we can safely wrap it in resolved tracked promise here
             */
            return TrackedPromise.resolved(this.instantiateClassWithResolvedDependencies(descriptor, promise[TrackedPromise.value]));
        }

        /**
         * @note Class constructor can't have async work, so we can safely wrap it in resolved tracked promise here
         */
        return TrackedPromise.resolved(new descriptor.constructor());
    }

    private instantiateFactory(descriptor: FactoryDependencyDescriptor<unknown>)
    {
        const subDependenciesKeys = descriptor.subDependenciesKeys;

        if (!isSafeReference(subDependenciesKeys) || subDependenciesKeys.length === 0)
            return descriptor.factory();

        switch (subDependenciesKeys.length)
        {
            case 1:
            {
                return descriptor.factory
                (
                    this.resolveDependencyByKey(subDependenciesKeys[0])
                );
            }
            case 2:
            {
                return descriptor.factory
                (
                    this.resolveDependencyByKey(subDependenciesKeys[0]),
                    this.resolveDependencyByKey(subDependenciesKeys[1])
                );
            }
            case 3:
            {
                return descriptor.factory
                (
                    this.resolveDependencyByKey(subDependenciesKeys[0]),
                    this.resolveDependencyByKey(subDependenciesKeys[1]),
                    this.resolveDependencyByKey(subDependenciesKeys[2])
                );
            }
            case 4:
            {
                return descriptor.factory
                (
                    this.resolveDependencyByKey(subDependenciesKeys[0]),
                    this.resolveDependencyByKey(subDependenciesKeys[1]),
                    this.resolveDependencyByKey(subDependenciesKeys[2]),
                    this.resolveDependencyByKey(subDependenciesKeys[3])
                );
            }
            case 5:
            {
                return descriptor.factory
                (
                    this.resolveDependencyByKey(subDependenciesKeys[0]),
                    this.resolveDependencyByKey(subDependenciesKeys[1]),
                    this.resolveDependencyByKey(subDependenciesKeys[2]),
                    this.resolveDependencyByKey(subDependenciesKeys[3]),
                    this.resolveDependencyByKey(subDependenciesKeys[4])
                );
            }
        }

        const dependencies = this.resolveDependencies(subDependenciesKeys);

        return isSafeReference(dependencies) 
            ? descriptor.factory(...dependencies)
            : descriptor.factory();
    }

    private instantiateAsyncFactory(descriptor: AsyncFactoryDependencyDescriptor<unknown>)
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
                        ? await this.instantiateFactoryWithResolvedDependencies(descriptor, dependencies)
                        : await descriptor.factory();
                };

                return TrackedPromise.track(resolveAsync());
            }

            /**
             * @note factory can have async work, so we can't reliably say if promise was resolved already or no...
             * So lets just track it
             */
            return TrackedPromise.track(this.instantiateFactoryWithResolvedDependencies(descriptor, promise[TrackedPromise.value]));
        }

        /**
         * @note factory can have async work, so we can't reliably say if promise was resolved already or no...
         * So lets just track it
         */
        return TrackedPromise.track(descriptor.factory());
    }

    private instantiateClassWithResolvedDependencies
    (
        descriptor: ClassDependencyDescriptor<unknown> | AsyncClassDependencyDescriptor<unknown>, 
        dependencies: unknown[]
    )
    {
        switch (dependencies.length)
        {
            case 0:
                return new descriptor.constructor();
            case 1:
            {
                return new descriptor.constructor
                (
                    dependencies[0]
                );
            }
            case 2:
            {
                return new descriptor.constructor
                (
                    dependencies[0], 
                    dependencies[1]
                );
            }
            case 3:
            {
                return new descriptor.constructor
                (
                    dependencies[0], 
                    dependencies[1], 
                    dependencies[2]
                );
            }
            case 4:
            {
                return new descriptor.constructor
                (
                    dependencies[0], 
                    dependencies[1], 
                    dependencies[2], 
                    dependencies[3]
                );
            }
            case 5:
            {
                return new descriptor.constructor
                (
                    dependencies[0], 
                    dependencies[1], 
                    dependencies[2], 
                    dependencies[3], 
                    dependencies[4]
                );
            }
            default:
                return new descriptor.constructor(...dependencies);
        }
    }

    private instantiateFactoryWithResolvedDependencies
    (
        descriptor: FactoryDependencyDescriptor<unknown>, 
        dependencies: unknown[]
    )
        : unknown;

    private instantiateFactoryWithResolvedDependencies
    (
        descriptor: AsyncFactoryDependencyDescriptor<unknown>, 
        dependencies: unknown[]
    )
        : Promise<unknown>;

    private instantiateFactoryWithResolvedDependencies
    (
        descriptor: FactoryDependencyDescriptor<unknown> | AsyncFactoryDependencyDescriptor<unknown>, 
        dependencies: unknown[]
    )
    {
        switch (dependencies.length)
        {
            case 0:
                return descriptor.factory();
            case 1:
            {
                return descriptor.factory
                (
                    dependencies[0]
                );
            }
            case 2:
            {
                return descriptor.factory
                (
                    dependencies[0], 
                    dependencies[1]
                );
            }
            case 3:
            {
                return descriptor.factory
                (
                    dependencies[0], 
                    dependencies[1], 
                    dependencies[2]
                );
            }
            case 4:
            {
                return descriptor.factory
                (
                    dependencies[0], 
                    dependencies[1], 
                    dependencies[2], 
                    dependencies[3]
                );
            }
            case 5:
            {
                return descriptor.factory
                (
                    dependencies[0], 
                    dependencies[1], 
                    dependencies[2], 
                    dependencies[3], 
                    dependencies[4]
                );
            }
            default:
                return descriptor.factory(...dependencies);
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
            (this.transientAsyncDisposables ??= []).push(dependency as AsyncDisposable);
        else if (isSafeReference((dependency as Partial<Disposable>)[Symbol.dispose]))
            (this.transientDependencies ??= []).push(dependency as Disposable);
    }

    public createChildScope(): DiScope<T_RegisteredDependencies>
    {
        return new DefaultDiScope(this.registry, this.root ?? this, this);
    }

    private async disposeAsyncDependencies(dependencies: [DependencyDescriptor, unknown][])
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
