import { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import { Constructor } from "@svs-tm/system";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";

import { createSyncResolver } from "../create-sync-resolver";

export function createFiveArgumentsClassStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Constructor extends Constructor<any[], any>
>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    constructor: T_Constructor,
    keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
)
    : InstantiationStrategy<InstanceType<T_Constructor>>
{
    const resolveDependency1 = createSyncResolver(collectionRegistrations, singularRegistrations, keys[0]);
    const resolveDependency2 = createSyncResolver(collectionRegistrations, singularRegistrations, keys[1]);
    const resolveDependency3 = createSyncResolver(collectionRegistrations, singularRegistrations, keys[2]);
    const resolveDependency4 = createSyncResolver(collectionRegistrations, singularRegistrations, keys[3]);
    const resolveDependency5 = createSyncResolver(collectionRegistrations, singularRegistrations, keys[4]);

    return (scope) => new constructor
    (
        resolveDependency1(scope),
        resolveDependency2(scope),
        resolveDependency3(scope),
        resolveDependency4(scope),
        resolveDependency5(scope)
    );
}
