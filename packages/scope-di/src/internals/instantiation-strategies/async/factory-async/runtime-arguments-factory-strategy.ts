import type { AsyncFactoryDependencyDescriptor } from "../../../../types/async-factory-dependency-descriptor";
import { generateIdentifier } from "../../../../helpers/internals/identifier-helpers";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { createAsyncFactoryStrategy } from "./create-async-factory-strategy";
import { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";

export function createRuntimeArgumentsAsyncFactoryStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncFactoryDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    const factory = descriptor.factory;
    const keys = descriptor.subDependenciesKeys ?? [];
    const id = generateIdentifier().toString();
    const factoryParameterName = `factory$${id}`;
    const dependenciesParameterName = `dependencies$${id}`;
    const resolvedDependencies = keys.map((_key, index) => `${dependenciesParameterName}[${index}]`)
        .join(", ");

    const strategyFactory = new Function
    (
        factoryParameterName,
        `return function instantiate$${id}(${dependenciesParameterName})
        {
            return ${factoryParameterName}(${resolvedDependencies});
        };`
    );

    return createAsyncFactoryStrategy
    (
        collectionRegistrations,
        singularRegistrations,
        descriptor,
        strategyFactory(factory)
    );
}

