import { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import { Constructor } from "@svs-tm/system";
import { generateIdentifier } from "../../../../helpers/internals/identifier-helpers";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";

import { createSyncResolver } from "../create-sync-resolver";

export function createRuntimeCodeGenerationClassStrategy
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
    const id = generateIdentifier().toString();
    const resolversParameterName = `resolvers$${id}`;
    const classParameterName = `Class$${id}`;
    const scopeParameterName = `scope$${id}`;

    const dependenciesResolution = keys.map
    (
        (_key, index) =>
        `const dependency${index} = ${resolversParameterName}[${index}](${scopeParameterName});`
    )
        .join("\n");

    const resolvedDependencies = keys.map((_key, index) =>`dependency${index}`)
        .join(", ");

    const strategyFactory = new Function
    (
        classParameterName,
        resolversParameterName,
        `return function instantiate$${id}(${scopeParameterName}) 
        {
            ${dependenciesResolution}

            return new ${classParameterName}(${resolvedDependencies});
        };`
    );

    return strategyFactory(constructor, resolvers);
}
