import { isSafeReference } from "@svs-tm/system";
import { DependencyNotRegisteredError } from "../../../../errors/dependency-not-registered-error";
import type { RegisteredDependencies, AllowedDependencyKey, DependencyResolutionKey, DependencyMappingKey } from "../../../../types";
import type { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import type { DefaultDiScope } from "../../../scope/default-di-scope";

export function createSyncResolver<T_RegisteredDependencies extends RegisteredDependencies>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    key: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>
)
{
    if (Array.isArray(key))
    {
        const descriptorsCollection = collectionRegistrations.get(key[0]);

        if (!isSafeReference(descriptorsCollection))
            throw new DependencyNotRegisteredError(key[0]);

        const descriptorsLength = descriptorsCollection.length;

        return (scope: DefaultDiScope<T_RegisteredDependencies>) =>
        {
            const collection = new Array(descriptorsLength);

            for (let descriptorIndex = 0; descriptorIndex < descriptorsLength; ++descriptorIndex)
                collection[descriptorIndex] = scope.resolveByDescriptor(descriptorsCollection[descriptorIndex]);

            return collection;
        };
    }
    else
    {
        const descriptor = singularRegistrations.get(key);

        if (!isSafeReference(descriptor))
            throw new DependencyNotRegisteredError(key);

        return (scope: DefaultDiScope<T_RegisteredDependencies>) =>
            scope.resolveByDescriptor(descriptor);
    }
}
