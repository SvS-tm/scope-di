import type { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import type { AsyncClassDependencyDescriptor } from "../../../../types/async-class-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import { createFiveArgumentsAsyncClassStrategy } from "./five-arguments-class-strategy";
import { createFourArgumentsAsyncClassStrategy } from "./four-arguments-class-strategy";
import { createOneArgumentAsyncClassStrategy } from "./one-argument-class-strategy";
import { createRuntimeCodeGenerationAsyncClassStrategy } from "./runtime-arguments-class-strategy";
import { createSpreadArgumentsAsyncClassStrategy } from "./spread-arguments-class-strategy";
import { createThreeArgumentsAsyncClassStrategy } from "./three-arguments-class-strategy";
import { createTwoArgumentsAsyncClassStrategy } from "./two-arguments-class-strategy";
import { createZeroArgumentsAsyncClassStrategy } from "./zero-arguments-async-class-strategy";

export function compileAsyncClassDescriptor
(
    descriptor: AsyncClassDependencyDescriptor<unknown, AllowedDependencyKey>,
    allowRuntimeCodeGeneration: boolean
)
    : RuntimeDependencyDescriptor
{
    const keys = descriptor.subDependenciesKeys;

    if (keys === undefined || keys.length === 0)
    {
        return {
            ...descriptor,
            instatiationStrategy: createZeroArgumentsAsyncClassStrategy(descriptor.constructor)
        };
    }

    switch (keys.length)
    {
        case 1:
        {
            return {
                ...descriptor,
                instatiationStrategy: createOneArgumentAsyncClassStrategy(descriptor.constructor, keys)
            };
        }
        case 2:
        {
            return {
                ...descriptor,
                instatiationStrategy: createTwoArgumentsAsyncClassStrategy(descriptor.constructor, keys)
            };
        }
        case 3:
        {
            return {
                ...descriptor,
                instatiationStrategy: createThreeArgumentsAsyncClassStrategy(descriptor.constructor, keys)
            };
        }
        case 4:
        {
            return {
                ...descriptor,
                instatiationStrategy: createFourArgumentsAsyncClassStrategy(descriptor.constructor, keys)
            };
        }
        case 5:
        {
            return {
                ...descriptor,
                instatiationStrategy: createFiveArgumentsAsyncClassStrategy(descriptor.constructor, keys)
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
                        instatiationStrategy: createRuntimeCodeGenerationAsyncClassStrategy(descriptor.constructor, keys)
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
                instatiationStrategy: createSpreadArgumentsAsyncClassStrategy(descriptor.constructor, keys)
            };
        }
    }
}

