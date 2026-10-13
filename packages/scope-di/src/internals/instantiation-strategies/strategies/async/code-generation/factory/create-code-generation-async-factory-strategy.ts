import type { AsyncFactoryDependencyDescriptor } from "../../../../../../types/async-factory-dependency-descriptor";
import { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";
import { createAsyncFactoryStrategy } from "../../predefined/factory/create-async-factory-strategy";
import { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import { createCodeGenerationAsyncFactoryConstruction } from "./create-code-generation-async-factory-construction";

export function createCodeGenerationAsyncFactoryStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncFactoryDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    return createAsyncFactoryStrategy
    (
        collectionRegistrations,
        singularRegistrations,
        descriptor,
        createCodeGenerationAsyncFactoryConstruction(descriptor)
    );
}
