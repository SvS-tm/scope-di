import { createZeroArgumentsFactoryStrategy } from "./argument-count/zero-arguments-factory-strategy";
import { createOneArgumentFactoryStrategy } from "./argument-count/one-argument-factory-strategy";
import { createTwoArgumentsFactoryStrategy } from "./argument-count/two-arguments-factory-strategy";
import { createThreeArgumentsFactoryStrategy } from "./argument-count/three-arguments-factory-strategy";
import { createFourArgumentsFactoryStrategy } from "./argument-count/four-arguments-factory-strategy";
import { createFiveArgumentsFactoryStrategy } from "./argument-count/five-arguments-factory-strategy";
import { createSpreadArgumentsFactoryStrategy } from "./argument-count/spread-arguments-factory-strategy";
import type { FactoryDependencyDescriptor } from "../../../../../../types/factory-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";

export function createFactoryStrategy<T_Dependency>
(
    descriptor: FactoryDependencyDescriptor<T_Dependency>,
    resolvers: InstantiationStrategy<unknown>[]
)
    : InstantiationStrategy<T_Dependency>
{
    switch (resolvers.length)
    {
        case 0:
            return createZeroArgumentsFactoryStrategy(descriptor);
        case 1:
            return createOneArgumentFactoryStrategy(descriptor, resolvers);
        case 2:
            return createTwoArgumentsFactoryStrategy(descriptor, resolvers);
        case 3:
            return createThreeArgumentsFactoryStrategy(descriptor, resolvers);
        case 4:
            return createFourArgumentsFactoryStrategy(descriptor, resolvers);
        case 5:
            return createFiveArgumentsFactoryStrategy(descriptor, resolvers);
        default:
            return createSpreadArgumentsFactoryStrategy(descriptor, resolvers);
    }
}
