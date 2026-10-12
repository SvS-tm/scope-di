import { Writable } from "@svs-tm/system";
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
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncClassDependencyDescriptor<unknown, AllowedDependencyKey>,
    allowRuntimeCodeGeneration: boolean
)
    : asserts descriptor is RuntimeDependencyDescriptor<
        AllowedDependencyKey,
        unknown,
        AsyncClassDependencyDescriptor<unknown, AllowedDependencyKey>
    >
{
    const keys = descriptor.subDependenciesKeys;
    const runtimeDescriptor = descriptor as Writable<RuntimeDependencyDescriptor>;

    if (keys === undefined || keys.length === 0)
    {
        runtimeDescriptor.instatiationStrategy = createZeroArgumentsAsyncClassStrategy
        (
            descriptor
        );

        return;
    }

    switch (keys.length)
    {
        case 1:
        {
            runtimeDescriptor.instatiationStrategy = createOneArgumentAsyncClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        case 2:
        {
            runtimeDescriptor.instatiationStrategy = createTwoArgumentsAsyncClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        case 3:
        {
            runtimeDescriptor.instatiationStrategy = createThreeArgumentsAsyncClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        case 4:
        {
            runtimeDescriptor.instatiationStrategy = createFourArgumentsAsyncClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        case 5:
        {
            runtimeDescriptor.instatiationStrategy = createFiveArgumentsAsyncClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        default:
        {
            if (allowRuntimeCodeGeneration)
            {
                try
                {
                    runtimeDescriptor.instatiationStrategy = createRuntimeCodeGenerationAsyncClassStrategy
                    (
                        collectionRegistrations,
                        singularRegistrations,
                        descriptor
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

            runtimeDescriptor.instatiationStrategy = createSpreadArgumentsAsyncClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
    }
}

