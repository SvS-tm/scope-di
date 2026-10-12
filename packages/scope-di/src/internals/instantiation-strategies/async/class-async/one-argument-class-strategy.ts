import type { AsyncClassDependencyDescriptor } from "../../../../types/async-class-dependency-descriptor";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { createAsyncClassStrategy } from "./create-async-class-strategy";
import { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";

export function createOneArgumentAsyncClassStrategy<T_Dependency>
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
        ([dependency]) => new constructor(dependency)
    );
}
