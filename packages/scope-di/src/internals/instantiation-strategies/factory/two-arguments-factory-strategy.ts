import { DiScope } from "../../../abstractions/di-scope";
import { DependencyFactory } from "../../../types/dependency-factory";
import { DependencyMappingKey } from "../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../types/dependency-resolution-key";
import { RegisteredDependencies } from "../../../types/registered-dependencies";
import { FactoryInstantiationStrategy } from "../../../types/factory-instantiation-strategy";

export function createTwoArgumentsFactoryStrategy
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
    return (scope: DiScope<T_RegisteredDependencies>) =>
    {
        const dependency1 = scope.resolve(keys[0]);
        const dependency2 = scope.resolve(keys[1]);

        return factory(dependency1, dependency2);
    };
}

