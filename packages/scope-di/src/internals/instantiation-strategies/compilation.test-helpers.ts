import type { AllowedDependencyKey, DependencyDescriptor, DependencyResolutionKey, RegisteredDependencies } from "../../types";
import type { RuntimeDependencyDescriptor } from "../../types/internals/runtime-dependency-descriptor";
import type { RuntimeDependencyDescriptorsBucket } from "../../types/internals/runtime-dependency-descriptors-bucket";
import { DefaultDiDependenciesRegistry } from "../registry/default-di-dependencies-registry";
import type { DefaultDiScope } from "../scope/default-di-scope";

export function compileTestDescriptor(descriptor: DependencyDescriptor): RuntimeDependencyDescriptor
{
    const registry = new DefaultDiDependenciesRegistry(new Map([[descriptor.key, descriptor]]), false);

    return registry.getDescriptors()[0];
}

export function getTestRegistrationMaps
(
    scope: DefaultDiScope<RegisteredDependencies>,
    keys: DependencyResolutionKey<AllowedDependencyKey>[] = []
)
{
    const collections = new Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>();
    const singulars = new Map<AllowedDependencyKey, RuntimeDependencyDescriptor>();

    for (const descriptor of scope.registry.getDescriptors())
    {
        const collection = collections.get(descriptor.key) ?? [];
        collection.push(descriptor);
        collections.set(descriptor.key, collection);

        if (!singulars.has(descriptor.key))
            singulars.set(descriptor.key, descriptor);
    }

    for (const key of keys)
    {
        if (Array.isArray(key))
            collections.set(key[0], scope.registry.resolveCollectionDescriptorsByKey(key[0]));
    }

    return [collections, singulars] as const;
}

export function getTestDescriptorBuckets
(
    scope: DefaultDiScope<RegisteredDependencies>,
    keys: DependencyResolutionKey<AllowedDependencyKey>[]
): RuntimeDependencyDescriptorsBucket[]
{
    return keys.map(key => Array.isArray(key)
        ? scope.registry.resolveCollectionDescriptorsByKey(key[0])
        : scope.registry.resolveSingularDescriptorByKey(key));
}
