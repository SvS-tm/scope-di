import { isNotSafeReference, isSafeReference, throwError } from "@svs-tm/system";
import type { DiScope } from "../abstractions";
import { DependencyNotRegisteredError } from "../errors/dependency-not-registered-error";
import { UnknownDependencyLifetimeError } from "../errors/unknown-dependency-lifetime-error";
import { UnknownDependencyTypeError } from "../errors/unknown-dependency-type-error";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import type { DependencyKey } from "../../types/dependency-key";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { InjectionResult } from "../../types/utilities/injection-result";

export class DefaultDiScope<T_RegisteredDependencies extends RegisteredDependencies = never> 
    implements DiScope<T_RegisteredDependencies>
{
    private readonly resolvedDependencies = new Map<AllowedDependencyKey, unknown>();

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

    private readonly resolveSubDependencies = async (keys?: AllowedDependencyKey[]) =>
    {
        const descriptors = keys?.map((key) => this.getDescriptor(key));

        if (isNotSafeReference(descriptors))
            return null;

        const asyncDependencies = descriptors
            .filter(this.isAsyncDependency)
            .map(({ key }) => this.resolve(key as DependencyKey<T_RegisteredDependencies>));

        const syncDependencies = descriptors
            .filter((descriptor) => !this.isAsyncDependency(descriptor))
            .map(({ key }) => this.resolve(key as DependencyKey<T_RegisteredDependencies>));

        const awaitedDependencies = await Promise.all(asyncDependencies);

        const dependencies = descriptors.map
        (
            ({ key }) => syncDependencies.find((dependency) => dependency.key === key)
                ?? awaitedDependencies.find((dependency) => dependency.key === key)
                ?? throwError(new DependencyNotRegisteredError(key))
        );

        return dependencies;
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
                    (key) => this.resolve(key as DependencyKey<T_RegisteredDependencies>)
                );

                return isSafeReference(dependencies) 
                    ? new descriptor.constructor(...dependencies)
                    : new descriptor.constructor();
            }
            case DependencyDescriptorType.ClassAsync:
            {
                const resolveAsync = async () =>
                {
                    const dependencies = await this.resolveSubDependencies(descriptor.subDependenciesKeys);

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
                    (key) => this.resolve(key as DependencyKey<T_RegisteredDependencies>)
                );

                return isSafeReference(dependencies) 
                    ? descriptor.factory(...dependencies)
                    : descriptor.factory();
            }
            case DependencyDescriptorType.FactoryAsync:
            {
                const resolveAsync = async () =>
                {
                    const dependencies = await this.resolveSubDependencies(descriptor.subDependenciesKeys);

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

    private readonly getDescriptor = (key: AllowedDependencyKey) =>
    {
        const descriptor = this.registry.get(key)?.[0];

        if (isNotSafeReference(descriptor))
            throw new DependencyNotRegisteredError(key);

        return descriptor;
    };

    private readonly resolveFromCurrentScope = (descriptor: DependencyDescriptor) =>
    {
        if (this.resolvedDependencies.has(descriptor.key))
            return this.resolvedDependencies.get(descriptor.key);

        const dependency = this.instantiate(descriptor);

        this.resolvedDependencies.set(descriptor.key, dependency);

        return dependency;
    };

    private readonly getHierarchy = function* (this: DefaultDiScope<T_RegisteredDependencies>)
    {
        for(let current = this.parent; isSafeReference(current); current = current.parent)
            yield current;
    };

    private readonly resolveFromScopeHierarchy = (descriptor: DependencyDescriptor) =>
    {
        const hierarchyScope = [...this.getHierarchy()]
            .findLast(({ resolvedDependencies }) => resolvedDependencies.has(descriptor.key));

        if (isSafeReference(hierarchyScope))
            return hierarchyScope.resolvedDependencies.get(descriptor.key);

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
        T_DependencyKey extends DependencyKey<T_RegisteredDependencies>
    >
    (
        key: T_DependencyKey
    )
        : InjectionResult<T_RegisteredDependencies, T_DependencyKey> =>
    {
        const descriptor = this.getDescriptor(key);

        return this.resolveByDescriptor(descriptor);
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
        for(const dependency of dependencies)
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
