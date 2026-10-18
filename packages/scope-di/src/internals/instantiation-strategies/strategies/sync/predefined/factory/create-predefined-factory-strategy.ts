import { createZeroArgumentsFactoryStrategy } from "./argument-count/zero-arguments-factory-strategy";
import { createOneArgumentFactoryStrategy } from "./argument-count/one-argument-factory-strategy";
import { createTwoArgumentsFactoryStrategy } from "./argument-count/two-arguments-factory-strategy";
import { createThreeArgumentsFactoryStrategy } from "./argument-count/three-arguments-factory-strategy";
import { createFourArgumentsFactoryStrategy } from "./argument-count/four-arguments-factory-strategy";
import { createFiveArgumentsFactoryStrategy } from "./argument-count/five-arguments-factory-strategy";
import { createSpreadArgumentsFactoryStrategy } from "./argument-count/spread-arguments-factory-strategy";
import type { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import type { FactoryDependencyDescriptor } from "../../../../../../types/factory-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";

export function createPredefinedFactoryStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: FactoryDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<T_Dependency>
{
    switch (descriptor.subDependenciesKeys?.length ?? 0)
    {
        case 0:
            return createZeroArgumentsFactoryStrategy(descriptor);
        case 1:
            return createOneArgumentFactoryStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 2:
            return createTwoArgumentsFactoryStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 3:
            return createThreeArgumentsFactoryStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 4:
            return createFourArgumentsFactoryStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 5:
            return createFiveArgumentsFactoryStrategy(collectionRegistrations, singularRegistrations, descriptor);
        default:
            return createSpreadArgumentsFactoryStrategy(collectionRegistrations, singularRegistrations, descriptor);
    }
}
