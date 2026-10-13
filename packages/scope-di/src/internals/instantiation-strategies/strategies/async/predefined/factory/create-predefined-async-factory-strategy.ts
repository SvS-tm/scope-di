import { createZeroArgumentsAsyncFactoryStrategy } from "./argument-count/zero-arguments-async-factory-strategy";
import { createOneArgumentAsyncFactoryStrategy } from "./argument-count/one-argument-factory-strategy";
import { createTwoArgumentsAsyncFactoryStrategy } from "./argument-count/two-arguments-factory-strategy";
import { createThreeArgumentsAsyncFactoryStrategy } from "./argument-count/three-arguments-factory-strategy";
import { createFourArgumentsAsyncFactoryStrategy } from "./argument-count/four-arguments-factory-strategy";
import { createFiveArgumentsAsyncFactoryStrategy } from "./argument-count/five-arguments-factory-strategy";
import { createSpreadArgumentsAsyncFactoryStrategy } from "./argument-count/spread-arguments-factory-strategy";
import type { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import type { AsyncFactoryDependencyDescriptor } from "../../../../../../types/async-factory-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";

export function createPredefinedAsyncFactoryStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncFactoryDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    switch (descriptor.subDependenciesKeys?.length ?? 0)
    {
        case 0:
            return createZeroArgumentsAsyncFactoryStrategy(descriptor);
        case 1:
            return createOneArgumentAsyncFactoryStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 2:
            return createTwoArgumentsAsyncFactoryStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 3:
            return createThreeArgumentsAsyncFactoryStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 4:
            return createFourArgumentsAsyncFactoryStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 5:
            return createFiveArgumentsAsyncFactoryStrategy(collectionRegistrations, singularRegistrations, descriptor);
        default:
            return createSpreadArgumentsAsyncFactoryStrategy(collectionRegistrations, singularRegistrations, descriptor);
    }
}
