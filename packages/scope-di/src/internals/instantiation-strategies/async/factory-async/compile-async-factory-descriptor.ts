import { Writable } from "@svs-tm/system";
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
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncFactoryDependencyDescriptor<unknown, AllowedDependencyKey>,
    allowRuntimeCodeGeneration: boolean
)
    : asserts descriptor is RuntimeDependencyDescriptor<
        AllowedDependencyKey,
        unknown,
        AsyncFactoryDependencyDescriptor<unknown, AllowedDependencyKey>
    >
{
    const keys = descriptor.subDependenciesKeys;
    const runtimeDescriptor = descriptor as Writable<RuntimeDependencyDescriptor>;

    if (keys === undefined || keys.length === 0)
    {
        runtimeDescriptor.instatiationStrategy = createZeroArgumentsAsyncFactoryStrategy
        (
            descriptor
        );

        return;
    }

    switch (keys.length)
    {
        case 1:
        {
            runtimeDescriptor.instatiationStrategy = createOneArgumentAsyncFactoryStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        case 2:
        {
            runtimeDescriptor.instatiationStrategy = createTwoArgumentsAsyncFactoryStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        case 3:
        {
            runtimeDescriptor.instatiationStrategy = createThreeArgumentsAsyncFactoryStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        case 4:
        {
            runtimeDescriptor.instatiationStrategy = createFourArgumentsAsyncFactoryStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        case 5:
        {
            runtimeDescriptor.instatiationStrategy = createFiveArgumentsAsyncFactoryStrategy
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
                    runtimeDescriptor.instatiationStrategy = createRuntimeArgumentsAsyncFactoryStrategy
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

            runtimeDescriptor.instatiationStrategy = createSpreadArgumentsAsyncFactoryStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
    }
}

