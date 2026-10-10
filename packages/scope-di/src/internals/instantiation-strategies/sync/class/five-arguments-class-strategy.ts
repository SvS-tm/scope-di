import { Constructor } from "@svs-tm/system";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { DefaultDiScope } from "../../../scope/default-di-scope";

export function createFiveArgumentsClassStrategy
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
        const dependency1 = scope.resolve(keys[0]);
        const dependency2 = scope.resolve(keys[1]);
        const dependency3 = scope.resolve(keys[2]);
        const dependency4 = scope.resolve(keys[3]);
        const dependency5 = scope.resolve(keys[4]);
    
        return new constructor(dependency1, dependency2, dependency3, dependency4, dependency5);
    };
}
