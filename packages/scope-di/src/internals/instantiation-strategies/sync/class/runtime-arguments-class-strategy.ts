import { Constructor, Reflection } from "@svs-tm/system";
import { DiScope } from "../../../../abstractions/di-scope";
import { generateIdentifier } from "../../../../helpers/internals/identifier-helpers";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";

export function createRuntimeCodeGenerationClassStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Constructor extends Constructor<any[], any>
>
(
    constructor: T_Constructor,
    keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
)
    : InstantiationStrategy<InstanceType<T_Constructor>>
{
    const id = generateIdentifier().toString();
    const resolutionMethodName = Reflection.runtimeNameOf<DiScope<T_RegisteredDependencies>>(scope => scope.resolve);
    const keysParameterName = `keys$${id}`;
    const classParameterName = `Class$${id}`;
    const scopeParameterName = `scope$${id}`;

    const dependenciesResolution = keys.map
    (
        (_key, index) =>
        `const dependency${index} = ${scopeParameterName}.${resolutionMethodName}(${keysParameterName}[${index}]);`
    )
        .join("\n");

    const resolvedDependencies = keys.map((_key, index) =>`dependency${index}`)
        .join(", ");

    const strategyFactory = new Function
    (
        classParameterName,
        keysParameterName,
        `return function instantiate$${id}(${scopeParameterName}) 
        {
            ${dependenciesResolution}

            return new ${classParameterName}(${resolvedDependencies});
        };`
    );

    return strategyFactory(constructor, keys);
}
