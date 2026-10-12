import type { AsyncClassDependencyDescriptor } from "../../../../types/async-class-dependency-descriptor";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { createAsyncClassStrategy } from "./create-async-class-strategy";
import { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";

export function createThreeArgumentsAsyncClassStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncClassDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    const constructor = descriptor.constructor;

    return createAsyncClassStrategy
    (
        collectionRegistrations,
        singularRegistrations,
        descriptor,
        ([dependency1, dependency2, dependency3]) => new constructor(dependency1, dependency2, dependency3)
    );
}

