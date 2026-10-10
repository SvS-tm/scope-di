import { generateIdentifier } from "../../../../helpers/internals/identifier-helpers";
import { DependencyFactory } from "../../../../types/dependency-factory";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { createAsyncFactoryStrategy } from "./create-async-factory-strategy";

export function createRuntimeArgumentsAsyncFactoryStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Factory extends DependencyFactory<any[], Promise<any>>
>
(
    factory: T_Factory,
    keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
)
    : InstantiationStrategy<Promise<Awaited<ReturnType<T_Factory>>>>
{
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

    return createAsyncFactoryStrategy(keys, strategyFactory(factory));
}

