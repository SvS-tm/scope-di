import { DependencyFactory } from "../../../../types/dependency-factory";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { DefaultDiScope } from "../../../scope/default-di-scope";

export function createOneArgumentFactoryStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Factory extends DependencyFactory<any[], any>
>
(
    factory: T_Factory,
    keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
)
    : InstantiationStrategy<ReturnType<T_Factory>>
{
    return (scope: DefaultDiScope<T_RegisteredDependencies>) =>
    {
        const dependency = scope.resolve(keys[0]);

        return factory(dependency);
    };
}

