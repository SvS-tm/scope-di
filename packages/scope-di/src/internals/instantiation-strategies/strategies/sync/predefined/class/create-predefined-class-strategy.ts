import { createZeroArgumentsClassStrategy } from "./argument-count/zero-arguments-class-strategy";
import { createOneArgumentClassStrategy } from "./argument-count/one-argument-class-strategy";
import { createTwoArgumentsClassStrategy } from "./argument-count/two-arguments-class-strategy";
import { createThreeArgumentsClassStrategy } from "./argument-count/three-arguments-class-strategy";
import { createFourArgumentsClassStrategy } from "./argument-count/four-arguments-class-strategy";
import { createFiveArgumentsClassStrategy } from "./argument-count/five-arguments-class-strategy";
import { createSpreadArgumentsClassStrategy } from "./argument-count/spread-arguments-class-strategy";
import type { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import type { ClassDependencyDescriptor } from "../../../../../../types/class-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";

export function createPredefinedClassStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: ClassDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<T_Dependency>
{
    switch (descriptor.subDependenciesKeys?.length ?? 0)
    {
        case 0:
            return createZeroArgumentsClassStrategy(descriptor);
        case 1:
            return createOneArgumentClassStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 2:
            return createTwoArgumentsClassStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 3:
            return createThreeArgumentsClassStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 4:
            return createFourArgumentsClassStrategy(collectionRegistrations, singularRegistrations, descriptor);
        case 5:
            return createFiveArgumentsClassStrategy(collectionRegistrations, singularRegistrations, descriptor);
        default:
            return createSpreadArgumentsClassStrategy(collectionRegistrations, singularRegistrations, descriptor);
    }
}
