import { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import { DependencyFactory } from "../../../../types/dependency-factory";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";

import { createSyncResolver } from "../create-sync-resolver";

export function createOneArgumentFactoryStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Factory extends DependencyFactory<any[], any>
>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    factory: T_Factory,
    keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
)
    : InstantiationStrategy<ReturnType<T_Factory>>
{
    const [key] = keys;

    const resolveDependency = createSyncResolver(collectionRegistrations, singularRegistrations, key);

    return (scope) => factory
    (
        resolveDependency(scope)
    );
}
