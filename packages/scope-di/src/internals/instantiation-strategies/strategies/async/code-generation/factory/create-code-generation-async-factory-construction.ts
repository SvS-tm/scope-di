import type { ConstructionStrategy } from "../../../../../../types/construction-strategy";
import type { AsyncFactoryDependencyDescriptor } from "../../../../../../types/async-factory-dependency-descriptor";
import { generateIdentifier } from "../../../../../../helpers/internals/identifier-helpers";

export function createCodeGenerationAsyncFactoryConstruction<T_Dependency>
(
    descriptor: AsyncFactoryDependencyDescriptor<T_Dependency>
)
    : ConstructionStrategy<Promise<T_Dependency>>
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

    return strategyFactory(factory);
}
