import { Constructor } from "@svs-tm/system";
import { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { createSyncResolver } from "../create-sync-resolver";

export function createOneArgumentClassStrategy
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
    const [key] = keys;

     const resolveDependency = createSyncResolver(collectionRegistrations, singularRegistrations, key);

    return (scope) => new constructor
    (
        resolveDependency(scope)
    );
}
