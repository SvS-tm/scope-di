import { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import { generateIdentifier } from "../../../../helpers/internals/identifier-helpers";
import { DependencyFactory } from "../../../../types/dependency-factory";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";

import { createSyncResolver } from "../create-sync-resolver";

export function createRuntimeArgumentsFactoryStrategy
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
    const resolvers = keys.map(key => createSyncResolver(collectionRegistrations, singularRegistrations, key));
    const id = generateIdentifier().toString();
    const resolversParameterName = `resolvers$${id}`;
    const factoryParameterName = `factory$${id}`;
    const scopeParameterName = `scope$${id}`;

    const dependenciesResolution = keys.map
    (
        (_key, index) =>
        `const dependency${index} = ${resolversParameterName}[${index}](${scopeParameterName});`
    )
        .join("\n");

    const resolvedDependencies = keys.map((_key, index) => `dependency${index}`)
        .join(", ");

    const strategyFactory = new Function
    (
        factoryParameterName,
        resolversParameterName,
        `return function instantiate$${id}(${scopeParameterName})
        {
            ${dependenciesResolution}

            return ${factoryParameterName}(${resolvedDependencies});
        };`
    );

    return strategyFactory(factory, resolvers);
}

