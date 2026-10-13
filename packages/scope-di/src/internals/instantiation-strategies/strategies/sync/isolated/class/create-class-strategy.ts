import { createZeroArgumentsClassStrategy } from "./argument-count/zero-arguments-class-strategy";
import { createOneArgumentClassStrategy } from "./argument-count/one-argument-class-strategy";
import { createTwoArgumentsClassStrategy } from "./argument-count/two-arguments-class-strategy";
import { createThreeArgumentsClassStrategy } from "./argument-count/three-arguments-class-strategy";
import { createFourArgumentsClassStrategy } from "./argument-count/four-arguments-class-strategy";
import { createFiveArgumentsClassStrategy } from "./argument-count/five-arguments-class-strategy";
import { createSpreadArgumentsClassStrategy } from "./argument-count/spread-arguments-class-strategy";
import type { ClassDependencyDescriptor } from "../../../../../../types/class-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";

export function createClassStrategy<T_Dependency>
(
    descriptor: ClassDependencyDescriptor<T_Dependency>,
    resolvers: InstantiationStrategy<unknown>[]
)
    : InstantiationStrategy<T_Dependency>
{
    switch (resolvers.length)
    {
        case 0:
            return createZeroArgumentsClassStrategy(descriptor);
        case 1:
            return createOneArgumentClassStrategy(descriptor, resolvers);
        case 2:
            return createTwoArgumentsClassStrategy(descriptor, resolvers);
        case 3:
            return createThreeArgumentsClassStrategy(descriptor, resolvers);
        case 4:
            return createFourArgumentsClassStrategy(descriptor, resolvers);
        case 5:
            return createFiveArgumentsClassStrategy(descriptor, resolvers);
        default:
            return createSpreadArgumentsClassStrategy(descriptor, resolvers);
    }
}

