import type { AsyncClassDependencyDescriptor } from "../../../../types/async-class-dependency-descriptor";
import { generateIdentifier } from "../../../../helpers/internals/identifier-helpers";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { createAsyncClassStrategy } from "./create-async-class-strategy";
import { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";

export function createRuntimeCodeGenerationAsyncClassStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncClassDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    const constructor = descriptor.constructor;
    const keys = descriptor.subDependenciesKeys ?? [];
    const id = generateIdentifier().toString();
    const constructorParameterName = `constructor$${id}`;
    const dependenciesParameterName = `dependencies$${id}`;
    const resolvedDependencies = keys.map((_key, index) => `${dependenciesParameterName}[${index}]`)
        .join(", ");

    const strategyFactory = new Function
    (
        constructorParameterName,
        `return function instantiate$${id}(${dependenciesParameterName})
        {
            return new ${constructorParameterName}(${resolvedDependencies});
        };`
    );

    return createAsyncClassStrategy
    (
        collectionRegistrations,
        singularRegistrations,
        descriptor,
        strategyFactory(constructor)
    );
}

