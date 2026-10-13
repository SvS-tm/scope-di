import { createZeroArgumentsAsyncClassStrategy } from "./argument-count/zero-arguments-async-class-strategy";
import { createOneArgumentAsyncClassStrategy } from "./argument-count/one-argument-class-strategy";
import { createTwoArgumentsAsyncClassStrategy } from "./argument-count/two-arguments-class-strategy";
import { createThreeArgumentsAsyncClassStrategy } from "./argument-count/three-arguments-class-strategy";
import { createFourArgumentsAsyncClassStrategy } from "./argument-count/four-arguments-class-strategy";
import { createFiveArgumentsAsyncClassStrategy } from "./argument-count/five-arguments-class-strategy";
import { createSpreadArgumentsAsyncClassStrategy } from "./argument-count/spread-arguments-class-strategy";
import type { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import type { AsyncClassDependencyDescriptor } from "../../../../../../types/async-class-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";

export function createPredefinedAsyncClassStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncClassDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    switch (descriptor.subDependenciesKeys?.length ?? 0)
    {
        case 0:
            return createZeroArgumentsAsyncClassStrategy(descriptor);
        case 1:
            return createOneArgumentAsyncClassStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 2:
            return createTwoArgumentsAsyncClassStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 3:
            return createThreeArgumentsAsyncClassStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 4:
            return createFourArgumentsAsyncClassStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 5:
            return createFiveArgumentsAsyncClassStrategy(collectionRegistrations, singularRegistrations, descriptor);
        default:
            return createSpreadArgumentsAsyncClassStrategy(collectionRegistrations, singularRegistrations, descriptor);
    }
}
