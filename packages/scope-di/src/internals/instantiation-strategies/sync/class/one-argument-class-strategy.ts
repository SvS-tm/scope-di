import { Constructor } from "@svs-tm/system";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import type { DefaultDiScope } from "../../../scope/default-di-scope";

export function createOneArgumentClassStrategy
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
    return (scope: DefaultDiScope<T_RegisteredDependencies>) =>
    {
        const dependency = scope.resolve(keys[0]);

        return new constructor(dependency);
    };
}
