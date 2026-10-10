import { Constructor } from "@svs-tm/system";
import { generateIdentifier } from "../../../../helpers/internals/identifier-helpers";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { createAsyncClassStrategy } from "./create-async-class-strategy";

export function createRuntimeCodeGenerationAsyncClassStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Constructor extends Constructor<any[], any>
>
(
    constructor: T_Constructor,
    keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
)
    : InstantiationStrategy<Promise<InstanceType<T_Constructor>>>
{
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

    return createAsyncClassStrategy(keys, strategyFactory(constructor));
}

