import { Constructor, Reflection } from "@svs-tm/system";
import { DiScope } from "../../../abstractions/di-scope";
import { generateIdentifier } from "../../../helpers/internals/identifier-helpers";
import { DependencyMappingKey } from "../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../types/dependency-resolution-key";
import { RegisteredDependencies } from "../../../types/registered-dependencies";
import { ClassInstantiationStrategy } from "../../../types/class-instantiation-strategy";

export function createRuntimeArgumentsClassStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Class extends Constructor<any[], any>
>
(
    Class: T_Class,
    keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
)
    : ClassInstantiationStrategy<T_RegisteredDependencies, T_Class>
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

    return strategyFactory(Class, keys);
}
