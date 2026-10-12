import { Writable } from "@svs-tm/system";
import { DependencyLifetime } from "../../../../types/dependency-lifetime";
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


    if (allowRuntimeCodeGeneration && ((descriptor.lifetime === DependencyLifetime.Transient) || (keys?.length ?? 0) > 5))
    {
        try
        {
            runtimeDescriptor.instatiationStrategy = createRuntimeCodeGenerationClassStrategy
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
             * Continue with the existing fixed-argument or spread strategy and shared tracking helper.
             * Generated bodies track inline; fallback strategies must still register disposable transients.
             */
        }
    }

    /**
     * @note TS doesn't recongnize keys as not empty in default case if we include it into switch
     * so leaving this workaround to make TS happy
     */
    if (keys === undefined || keys.length === 0)
    {
        runtimeDescriptor.instatiationStrategy = createZeroArgumentsClassStrategy
        (
            descriptor
        );

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
                descriptor
            );

            return;
        }
        case 2:
        {
            runtimeDescriptor.instatiationStrategy = createTwoArgumentsClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        case 3:
        {
            runtimeDescriptor.instatiationStrategy = createThreeArgumentsClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        case 4:
        {
            runtimeDescriptor.instatiationStrategy = createFourArgumentsClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        case 5:
        {
            runtimeDescriptor.instatiationStrategy = createFiveArgumentsClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        default:
        {
            runtimeDescriptor.instatiationStrategy = createSpreadArgumentsClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
    }
}
