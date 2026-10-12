import { Writable } from "@svs-tm/system";
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
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: ClassDependencyDescriptor<unknown, AllowedDependencyKey>,
    allowRuntimeCodeGeneration: boolean
)
    : asserts descriptor is RuntimeDependencyDescriptor<
        AllowedDependencyKey,
        unknown,
        ClassDependencyDescriptor<unknown, AllowedDependencyKey>
    >
{
    const keys = descriptor.subDependenciesKeys;
    const runtimeDescriptor = descriptor as Writable<RuntimeDependencyDescriptor>;

    /**
     * @note TS doesn't recongnize keys as not empty in default case if we include it into switch
     * so leaving this workaround to make TS happy
     */
    if (keys === undefined || keys.length === 0)
    {
        runtimeDescriptor.instatiationStrategy = createZeroArgumentsClassStrategy(descriptor.constructor);

        return;
    }

    switch (keys.length)
    {
        case 1:
        {
            runtimeDescriptor.instatiationStrategy = createOneArgumentClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor.constructor, 
                keys
            );

            return;
        }
        case 2:
        {
            runtimeDescriptor.instatiationStrategy = createTwoArgumentsClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor.constructor,
                keys
            );

            return;
        }
        case 3:
        {
            runtimeDescriptor.instatiationStrategy = createThreeArgumentsClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor.constructor,
                keys
            );

            return;
        }
        case 4:
        {
            runtimeDescriptor.instatiationStrategy = createFourArgumentsClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor.constructor,
                keys
            );

            return;
        }
        case 5:
        {
            runtimeDescriptor.instatiationStrategy = createFiveArgumentsClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor.constructor,
                keys
            );

            return;
        }
        default:
        {
            if (allowRuntimeCodeGeneration)
            {
                try
                {
                    runtimeDescriptor.instatiationStrategy = createRuntimeCodeGenerationClassStrategy
                    (
                        collectionRegistrations,
                        singularRegistrations,
                        descriptor.constructor,
                        keys
                    );

                    return;
                }
                catch
                {
                    /**
                     * @note Some runtimes or CSP policies block new Function.
                     * Fall back to spread so compilation can still succeed when code generation is enabled.
                     */
                }
            }

            runtimeDescriptor.instatiationStrategy = createSpreadArgumentsClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor.constructor,
                keys
            );

            return;
        }
    }
}
