import type { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import type { ClassDependencyDescriptor } from "../../../../types/class-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import { createFiveArgumentsClassStrategy } from "./five-arguments-class-strategy";
import { createFourArgumentsClassStrategy } from "./four-arguments-class-strategy";
import { createOneArgumentClassStrategy } from "./one-argument-class-strategy";
import { createRuntimeCodeGenerationClassStrategy } from "./runtime-arguments-class-strategy";
import { createSpreadArgumentsClassStrategy } from "./spread-arguments-class-strategy";
import { createThreeArgumentsClassStrategy } from "./three-arguments-class-strategy";
import { createTwoArgumentsClassStrategy } from "./two-arguments-class-strategy";
import { createZeroArgumentsClassStrategy } from "./zero-arguments-class-strategy";

export function compileClassDescriptor
(
    descriptor: ClassDependencyDescriptor<unknown, AllowedDependencyKey>, 
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
            instatiationStrategy: createZeroArgumentsClassStrategy(descriptor.constructor)
        };
    }

    switch (keys.length)
    {
        case 1:
        {
            return {
                ...descriptor,
                instatiationStrategy: createOneArgumentClassStrategy(descriptor.constructor, keys)
            };
        }
        case 2:
        {
            return {
                ...descriptor,
                instatiationStrategy: createTwoArgumentsClassStrategy(descriptor.constructor, keys)
            };
        }
        case 3:
        {
            return {
                ...descriptor,
                instatiationStrategy: createThreeArgumentsClassStrategy(descriptor.constructor, keys)
            };
        }
        case 4:
        {
            return {
                ...descriptor,
                instatiationStrategy: createFourArgumentsClassStrategy(descriptor.constructor, keys)
            };
        }
        case 5:
        {
            return {
                ...descriptor,
                instatiationStrategy: createFiveArgumentsClassStrategy(descriptor.constructor, keys)
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
                        instatiationStrategy: createRuntimeCodeGenerationClassStrategy(descriptor.constructor, keys)
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
                instatiationStrategy: createSpreadArgumentsClassStrategy(descriptor.constructor, keys)
            };
        }
    }
}
