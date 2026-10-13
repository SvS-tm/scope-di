import { createAsyncFactoryExecutionStrategy } from "../create-async-factory-execution-strategy";
import type { AsyncFactoryDependencyDescriptor } from "../../../../../../../types/async-factory-dependency-descriptor";
import type { AllowedDependencyKey } from "../../../../../../../types/allowed-dependency-key";
import type { RuntimeDependencyDescriptor } from "../../../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../../types/instantiation-strategy";

export function createTwoArgumentsAsyncFactoryStrategy<T_Dependency>
(
    collections: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singles: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncFactoryDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    const factory = descriptor.factory;

    return createAsyncFactoryExecutionStrategy
    (
        collections,
        singles,
        descriptor,
        values => factory(values[0], values[1])
    );
}
