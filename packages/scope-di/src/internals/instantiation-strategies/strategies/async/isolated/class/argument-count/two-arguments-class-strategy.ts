import { createAsyncClassExecutionStrategy } from "../create-async-class-execution-strategy";
import type { AsyncClassDependencyDescriptor } from "../../../../../../../types/async-class-dependency-descriptor";
import type { AllowedDependencyKey } from "../../../../../../../types/allowed-dependency-key";
import type { RuntimeDependencyDescriptor } from "../../../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../../types/instantiation-strategy";

export function createTwoArgumentsAsyncClassStrategy<T_Dependency>
(
    collections: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singles: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncClassDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    const constructor = descriptor.constructor;

    return createAsyncClassExecutionStrategy
    (
        collections,
        singles,
        descriptor,
        values => new constructor(values[0], values[1])
    );
}
