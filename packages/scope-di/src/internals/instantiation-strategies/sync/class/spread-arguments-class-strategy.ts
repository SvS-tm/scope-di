import { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import { Constructor } from "@svs-tm/system";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { DefaultDiScope } from "../../../scope/default-di-scope";

import { createSyncResolver } from "../create-sync-resolver";

export function createSpreadArgumentsClassStrategy
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
    const resolvers = keys.map(key => createSyncResolver(collectionRegistrations, singularRegistrations, key));

    return (scope: DefaultDiScope<T_RegisteredDependencies>) =>
    {
        const dependencies = resolvers.map(resolveDependency => resolveDependency(scope));

        return new constructor(...dependencies);
    };
}
