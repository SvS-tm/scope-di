import type { ConstructionStrategy } from "../../../../../../types/construction-strategy";
import type { AsyncClassDependencyDescriptor } from "../../../../../../types/async-class-dependency-descriptor";
import { generateIdentifier } from "../../../../../../helpers/internals/identifier-helpers";

export function createCodeGenerationAsyncClassConstruction<T_Dependency>
(
    descriptor: AsyncClassDependencyDescriptor<T_Dependency>
)
    : ConstructionStrategy<T_Dependency>
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

    return strategyFactory(constructor);
}
