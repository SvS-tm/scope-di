import type { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import type { AsyncFactoryDependencyDescriptor } from "../../../../types/async-factory-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import { createFiveArgumentsAsyncFactoryStrategy } from "./five-arguments-factory-strategy";
import { createFourArgumentsAsyncFactoryStrategy } from "./four-arguments-factory-strategy";
import { createOneArgumentAsyncFactoryStrategy } from "./one-argument-factory-strategy";
import { createRuntimeArgumentsAsyncFactoryStrategy } from "./runtime-arguments-factory-strategy";
import { createSpreadArgumentsAsyncFactoryStrategy } from "./spread-arguments-factory-strategy";
import { createThreeArgumentsAsyncFactoryStrategy } from "./three-arguments-factory-strategy";
import { createTwoArgumentsAsyncFactoryStrategy } from "./two-arguments-factory-strategy";
import { createZeroArgumentsAsyncFactoryStrategy } from "./zero-arguments-async-factory-strategy";

export function compileAsyncFactoryDescriptor
(
    descriptor: AsyncFactoryDependencyDescriptor<unknown, AllowedDependencyKey>,
    allowRuntimeCodeGeneration: boolean
)
    : RuntimeDependencyDescriptor
{
    const keys = descriptor.subDependenciesKeys;

    if (keys === undefined || keys.length === 0)
    {
        return {
            ...descriptor,
            instatiationStrategy: createZeroArgumentsAsyncFactoryStrategy(descriptor.factory)
        };
    }

    switch (keys.length)
    {
        case 1:
        {
            return {
                ...descriptor,
                instatiationStrategy: createOneArgumentAsyncFactoryStrategy(descriptor.factory, keys)
            };
        }
        case 2:
        {
            return {
                ...descriptor,
                instatiationStrategy: createTwoArgumentsAsyncFactoryStrategy(descriptor.factory, keys)
            };
        }
        case 3:
        {
            return {
                ...descriptor,
                instatiationStrategy: createThreeArgumentsAsyncFactoryStrategy(descriptor.factory, keys)
            };
        }
        case 4:
        {
            return {
                ...descriptor,
                instatiationStrategy: createFourArgumentsAsyncFactoryStrategy(descriptor.factory, keys)
            };
        }
        case 5:
        {
            return {
                ...descriptor,
                instatiationStrategy: createFiveArgumentsAsyncFactoryStrategy(descriptor.factory, keys)
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
                        instatiationStrategy: createRuntimeArgumentsAsyncFactoryStrategy(descriptor.factory, keys)
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
                instatiationStrategy: createSpreadArgumentsAsyncFactoryStrategy(descriptor.factory, keys)
            };
        }
    }
}

