import type { AsyncClassDependencyDescriptor } from "../../../../../../types/async-class-dependency-descriptor";
import { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";
import { createAsyncClassStrategy } from "../../predefined/class/create-async-class-strategy";
import { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import { createCodeGenerationAsyncClassConstruction } from "./create-code-generation-async-class-construction";

export function createCodeGenerationAsyncClassStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncClassDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    return createAsyncClassStrategy
    (
        collectionRegistrations,
        singularRegistrations,
        descriptor,
        createCodeGenerationAsyncClassConstruction(descriptor)
    );
}
