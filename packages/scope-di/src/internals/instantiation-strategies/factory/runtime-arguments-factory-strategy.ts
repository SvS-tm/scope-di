import { Reflection } from "@svs-tm/system";
import { DiScope } from "../../../abstractions/di-scope";
import { generateIdentifier } from "../../../helpers/internals/identifier-helpers";
import { DependencyFactory } from "../../../types/dependency-factory";
import { DependencyMappingKey } from "../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../types/dependency-resolution-key";
import { RegisteredDependencies } from "../../../types/registered-dependencies";
import { FactoryInstantiationStrategy } from "../../../types/factory-instantiation-strategy";

export function createRuntimeArgumentsFactoryStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Factory extends DependencyFactory<any[], any>
>
(
    factory: T_Factory,
    keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
)
    : FactoryInstantiationStrategy<T_RegisteredDependencies, T_Factory>
{
    const id = generateIdentifier().toString();
    const resolutionMethodName = Reflection.runtimeNameOf<DiScope<T_RegisteredDependencies>>(scope => scope.resolve);
    const keysParameterName = `keys$${id}`;
    const factoryParameterName = `factory$${id}`;
    const scopeParameterName = `scope$${id}`;

    const dependenciesResolution = keys.map
    (
        (_key, index) =>
        `const dependency${index} = ${scopeParameterName}.${resolutionMethodName}(${keysParameterName}[${index}]);`
    )
        .join("\n");

    const resolvedDependencies = keys.map((_key, index) => `dependency${index}`)
        .join(", ");

    const strategyFactory = new Function
    (
        factoryParameterName,
        keysParameterName,
        `return function instantiate$${id}(${scopeParameterName})
        {
            ${dependenciesResolution}

            return ${factoryParameterName}(${resolvedDependencies});
        };`
    );

    return strategyFactory(factory, keys);
}

