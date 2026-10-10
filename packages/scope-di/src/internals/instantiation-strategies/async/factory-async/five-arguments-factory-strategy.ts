import { DependencyFactory } from "../../../../types/dependency-factory";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { createAsyncFactoryStrategy } from "./create-async-factory-strategy";

export function createFiveArgumentsAsyncFactoryStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Factory extends DependencyFactory<any[], Promise<any>>
>
(
    factory: T_Factory,
    keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
)
    : InstantiationStrategy<Promise<Awaited<ReturnType<T_Factory>>>>
{
    return createAsyncFactoryStrategy
    (
        keys,
        ([dependency1, dependency2, dependency3, dependency4, dependency5]) => factory(dependency1, dependency2, dependency3, dependency4, dependency5)
    );
}

