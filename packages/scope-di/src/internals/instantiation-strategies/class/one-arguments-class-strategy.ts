import { Constructor } from "@svs-tm/system";
import { DiScope } from "../../../abstractions/di-scope";
import { DependencyMappingKey } from "../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../types/dependency-resolution-key";
import { RegisteredDependencies } from "../../../types/registered-dependencies";
import { ClassInstantiationStrategy } from "../../../types/class-instantiation-strategy";

export function createOneArgumentsClassStrategy
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
    return (scope: DiScope<T_RegisteredDependencies>) =>
    {
        const dependency = scope.resolve(keys[0]);

        return new Class(dependency);
    };
}
