import { Writable } from "@svs-tm/system";
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
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: FactoryDependencyDescriptor<unknown, AllowedDependencyKey>, 
    allowRuntimeCodeGeneration: boolean
)
    : asserts descriptor is RuntimeDependencyDescriptor<
        AllowedDependencyKey,
        unknown,
        FactoryDependencyDescriptor<unknown, AllowedDependencyKey>
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
        runtimeDescriptor.instatiationStrategy = createZeroArgumentsFactoryStrategy(descriptor.factory);

        return;
    }

    switch (keys.length)
    {
        case 1:
        {
            runtimeDescriptor.instatiationStrategy = createOneArgumentFactoryStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor.factory,
                keys
            );

            return;
        }
        case 2:
        {
            runtimeDescriptor.instatiationStrategy = createTwoArgumentsFactoryStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor.factory,
                keys
            );

            return;
        }
        case 3:
        {
            runtimeDescriptor.instatiationStrategy = createThreeArgumentsFactoryStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor.factory,
                keys
            );

            return;
        }
        case 4:
        {
            runtimeDescriptor.instatiationStrategy = createFourArgumentsFactoryStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor.factory,
                keys
            );

            return;
        }
        case 5:
        {
            runtimeDescriptor.instatiationStrategy = createFiveArgumentsFactoryStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor.factory,
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
                    runtimeDescriptor.instatiationStrategy = createRuntimeArgumentsFactoryStrategy
                    (
                        collectionRegistrations,
                        singularRegistrations,
                        descriptor.factory,
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

            runtimeDescriptor.instatiationStrategy = createSpreadArgumentsFactoryStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor.factory,
                keys
            );

            return;
        }
    }
}
