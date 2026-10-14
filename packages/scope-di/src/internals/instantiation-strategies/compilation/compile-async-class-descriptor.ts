import { Logging } from "../../../helpers/internals/logging";
import { createIsolatedAsyncClassStrategy } from "../strategies/async/isolated/class/create-isolated-async-class-strategy";
import { createPredefinedAsyncClassStrategy } from "../strategies/async/predefined/class/create-predefined-async-class-strategy";
import { DependencyLifetime } from "../../../types/dependency-lifetime";
import type * as IsolatedTransientStrategies from "../strategies/isolated-transient-strategies";
import { Writable } from "@svs-tm/system";
import type { AllowedDependencyKey } from "../../../types/allowed-dependency-key";
import type { AsyncClassDependencyDescriptor } from "../../../types/async-class-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../types/internals/runtime-dependency-descriptor";
import { createCodeGenerationAsyncClassStrategy } from "../strategies/async/code-generation/class/create-code-generation-async-class-strategy";

export function compileAsyncClassDescriptor
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncClassDependencyDescriptor<unknown, AllowedDependencyKey>,
    allowRuntimeCodeGeneration: boolean,
    isolatedTransientStrategies?: typeof IsolatedTransientStrategies
)
    : asserts descriptor is RuntimeDependencyDescriptor<
        AllowedDependencyKey,
        unknown,
        AsyncClassDependencyDescriptor<unknown, AllowedDependencyKey>
    >
{
    const keys = descriptor.subDependenciesKeys;
    const runtimeDescriptor = descriptor as Writable<RuntimeDependencyDescriptor>;

    /**
     * See compileClassDescriptor for the isolation rationale and runtime observations.
     * Prefer isolation for transients up to five arguments; cached lifetimes handle disposal separately.
     * Async isolation keeps construction and Promise execution in the module; gains remain unmeasured.
     */
    if (isolatedTransientStrategies !== undefined && descriptor.lifetime === DependencyLifetime.Transient && (keys?.length ?? 0) <= 5)
    {
        runtimeDescriptor.instatiationStrategy = createIsolatedAsyncClassStrategy
        (
            collectionRegistrations,
            singularRegistrations,
            descriptor,
            isolatedTransientStrategies
        );

        return;
    }

    /**
     * @note If enabled, use codegen for any transient reaching this branch. Small isolated cases
     * already returned above. For other lifetimes, use it only above five arguments.
     * It creates a body per descriptor and replaces spread with explicit arguments.
     * Sync benchmarks improved on wider graphs, but cold resolution became more expensive.
     * Generation can be disabled; its benefit depends on the graph and runtime.
     * Async codegen changes construction only; Promise handling and the dependency array remain.
     */
    if (allowRuntimeCodeGeneration && ((descriptor.lifetime === DependencyLifetime.Transient) || (keys?.length ?? 0) > 5))
    {
        try
        {
            runtimeDescriptor.instatiationStrategy = createCodeGenerationAsyncClassStrategy
            (
                collectionRegistrations,
                singularRegistrations,
                descriptor
            );

            return;
        }
        catch (error)
        {
            Logging.warning("Code generation failed; continuing with a fallback strategy.", descriptor.key, error);
            /**
             * @note Some runtimes or CSP policies block new Function.
             * Fall back to isolated spread when available, otherwise predefined spread.
              */
        }
    }

    /**
     * @note If generation is disabled or blocked, retain module isolation for transient descriptors.
     * Larger argument counts still use spread here; isolation and unrolled calls are separate benefits.
      */
    if (isolatedTransientStrategies !== undefined && descriptor.lifetime === DependencyLifetime.Transient)
    {
        runtimeDescriptor.instatiationStrategy = createIsolatedAsyncClassStrategy
        (
            collectionRegistrations,
            singularRegistrations,
            descriptor,
            isolatedTransientStrategies
        );

        return;
    }

    // Default: predefined argument-count cases or spread, with the usual lifetime tracking.
    runtimeDescriptor.instatiationStrategy = createPredefinedAsyncClassStrategy
    (
        collectionRegistrations,
        singularRegistrations,
        descriptor
    );
}
