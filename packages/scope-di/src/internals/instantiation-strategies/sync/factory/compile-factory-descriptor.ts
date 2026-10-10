import type { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import type { FactoryDependencyDescriptor } from "../../../../types/factory-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import { createFiveArgumentsFactoryStrategy } from "./five-arguments-factory-strategy";
import { createFourArgumentsFactoryStrategy } from "./four-arguments-factory-strategy";
import { createOneArgumentFactoryStrategy } from "./one-argument-factory-strategy";
import { createRuntimeArgumentsFactoryStrategy } from "./runtime-arguments-factory-strategy";
import { createSpreadArgumentsFactoryStrategy } from "./spread-arguments-factory-strategy";
import { createThreeArgumentsFactoryStrategy } from "./three-arguments-factory-strategy";
import { createTwoArgumentsFactoryStrategy } from "./two-arguments-factory-strategy";
import { createZeroArgumentsFactoryStrategy } from "./zero-arguments-factory-strategy";

export function compileFactoryDescriptor
(
    descriptor: FactoryDependencyDescriptor<unknown, AllowedDependencyKey>, 
    allowRuntimeCodeGeneration: boolean
)
    : RuntimeDependencyDescriptor
{
    const keys = descriptor.subDependenciesKeys;

    /**
     * @note TS doesn't recongnize keys as not empty in default case if we include it into switch
     * so leaving this workaround to make TS happy
     */
    if (keys === undefined || keys.length === 0)
    {
        return {
            ...descriptor,
            instatiationStrategy: createZeroArgumentsFactoryStrategy(descriptor.factory)
        };
    }

    switch (keys.length)
    {
        case 1:
        {
            return {
                ...descriptor,
                instatiationStrategy: createOneArgumentFactoryStrategy(descriptor.factory, keys)
            };
        }
        case 2:
        {
            return {
                ...descriptor,
                instatiationStrategy: createTwoArgumentsFactoryStrategy(descriptor.factory, keys)
            };
        }
        case 3:
        {
            return {
                ...descriptor,
                instatiationStrategy: createThreeArgumentsFactoryStrategy(descriptor.factory, keys)
            };
        }
        case 4:
        {
            return {
                ...descriptor,
                instatiationStrategy: createFourArgumentsFactoryStrategy(descriptor.factory, keys)
            };
        }
        case 5:
        {
            return {
                ...descriptor,
                instatiationStrategy: createFiveArgumentsFactoryStrategy(descriptor.factory, keys)
            };
        }
        default:
        {
            if (allowRuntimeCodeGeneration)
            {
                try
                {
                    return {
                        ...descriptor,
                        instatiationStrategy: createRuntimeArgumentsFactoryStrategy(descriptor.factory, keys)
                    };
                }
                catch
                {
                    /**
                     * @note Some runtimes or CSP policies block new Function.
                     * Fall back to spread so compilation can still succeed when code generation is enabled.
                     */
                }
            }

            return {
                ...descriptor,
                instatiationStrategy: createSpreadArgumentsFactoryStrategy(descriptor.factory, keys)
            };
        }
    }
}
