import type { AsyncFactoryDependencyDescriptor } from "../../../../../../../types/async-factory-dependency-descriptor";
import { InstantiationStrategy } from "../../../../../../../types/instantiation-strategy";
import { createAsyncFactoryStrategy } from "../create-async-factory-strategy";
import { AllowedDependencyKey } from "../../../../../../../types/allowed-dependency-key";
import { RuntimeDependencyDescriptor } from "../../../../../../../types/internals/runtime-dependency-descriptor";

export function createOneArgumentAsyncFactoryStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncFactoryDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    const factory = descriptor.factory;

    return createAsyncFactoryStrategy
    (
        collectionRegistrations,
        singularRegistrations,
        descriptor,
        ([dependency]) => factory(dependency)
    );
}

