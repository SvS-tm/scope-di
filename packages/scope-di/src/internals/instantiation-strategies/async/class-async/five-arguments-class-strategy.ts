import { Constructor } from "@svs-tm/system";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { createAsyncClassStrategy } from "./create-async-class-strategy";

export function createFiveArgumentsAsyncClassStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Constructor extends Constructor<any[], any>
>
(
    constructor: T_Constructor,
    keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
)
    : InstantiationStrategy<Promise<InstanceType<T_Constructor>>>
{
    return createAsyncClassStrategy
    (
        keys,
        ([dependency1, dependency2, dependency3, dependency4, dependency5]) => new constructor(dependency1, dependency2, dependency3, dependency4, dependency5)
    );
}

