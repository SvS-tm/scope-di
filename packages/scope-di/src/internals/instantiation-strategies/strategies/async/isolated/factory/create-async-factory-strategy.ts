import { createZeroArgumentsAsyncFactoryStrategy } from "./argument-count/zero-arguments-factory-strategy";
import { createOneArgumentAsyncFactoryStrategy } from "./argument-count/one-argument-factory-strategy";
import { createTwoArgumentsAsyncFactoryStrategy } from "./argument-count/two-arguments-factory-strategy";
import { createThreeArgumentsAsyncFactoryStrategy } from "./argument-count/three-arguments-factory-strategy";
import { createFourArgumentsAsyncFactoryStrategy } from "./argument-count/four-arguments-factory-strategy";
import { createFiveArgumentsAsyncFactoryStrategy } from "./argument-count/five-arguments-factory-strategy";
import { createSpreadArgumentsAsyncFactoryStrategy } from "./argument-count/spread-arguments-factory-strategy";
import type { AsyncFactoryDependencyDescriptor } from "../../../../../../types/async-factory-dependency-descriptor";
import type { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import type { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";

export function createAsyncFactoryStrategy<T_Dependency>
(
    collections: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singles: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncFactoryDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    switch (descriptor.subDependenciesKeys?.length ?? 0)
    {
        case 0:
            return createZeroArgumentsAsyncFactoryStrategy(descriptor);
        case 1:
            return createOneArgumentAsyncFactoryStrategy(collections, singles, descriptor);
        case 2:
            return createTwoArgumentsAsyncFactoryStrategy(collections, singles, descriptor);
        case 3:
            return createThreeArgumentsAsyncFactoryStrategy(collections, singles, descriptor);
        case 4:
            return createFourArgumentsAsyncFactoryStrategy(collections, singles, descriptor);
        case 5:
            return createFiveArgumentsAsyncFactoryStrategy(collections, singles, descriptor);
        default:
            return createSpreadArgumentsAsyncFactoryStrategy(collections, singles, descriptor);
    }
}
