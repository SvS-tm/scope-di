import { Constructor } from "@svs-tm/system";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { DefaultDiScope } from "../../../scope/default-di-scope";

export function createSpreadArgumentsClassStrategy
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
        const dependencies = keys.map(key => scope.resolve(key));

        return new constructor(...dependencies);
    };
}
