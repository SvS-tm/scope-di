import { Logging } from "../../../helpers/internals/logging";
import { createIsolatedAsyncFactoryStrategy } from "../strategies/async/isolated/factory/create-isolated-async-factory-strategy";
import { createPredefinedAsyncFactoryStrategy } from "../strategies/async/predefined/factory/create-predefined-async-factory-strategy";
import { DependencyLifetime } from "../../../types/dependency-lifetime";
import type * as IsolatedTransientStrategies from "../strategies/isolated-transient-strategies";
import { Writable } from "@svs-tm/system";
import type { AllowedDependencyKey } from "../../../types/allowed-dependency-key";
import type { AsyncFactoryDependencyDescriptor } from "../../../types/async-factory-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../types/internals/runtime-dependency-descriptor";
import { createCodeGenerationAsyncFactoryStrategy } from "../strategies/async/code-generation/factory/create-code-generation-async-factory-strategy";

export function compileAsyncFactoryDescriptor
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncFactoryDependencyDescriptor<unknown, AllowedDependencyKey>,
    allowRuntimeCodeGeneration: boolean,
    isolatedTransientStrategies?: typeof IsolatedTransientStrategies
)
    : asserts descriptor is RuntimeDependencyDescriptor<
        AllowedDependencyKey,
        unknown,
        AsyncFactoryDependencyDescriptor<unknown, AllowedDependencyKey>
    >
{
    const keys = descriptor.subDependenciesKeys;
    const runtimeDescriptor = descriptor as Writable<RuntimeDependencyDescriptor>;

    /**
     * @note buildAsync loads one module instance per transient descriptor using a unique query.
     * Its strategy is created once and reused; no imports happen during resolution.
     *
     * Experiments showed that shared disposal-symbol checks cost a lot on transient deep chains.
     * V8 feedback dumps showed megamorphic accesses: one detector saw many object shapes.
     * Separate module bodies gave each descriptor its own feedback sites, so stable shapes could
     * stay monomorphic. New closures from the same body did not separate that feedback.
     *
     * Sync benchmarks favored isolation for deep chains and small argument counts, but not for
     * factories changing shape. Prefer it up to five arguments; try codegen for larger counts.
     * Isolation can be disabled because loading takes time and retains module instances in memory.
     * These bodies track transients. Cached lifetimes check disposal later, from their caches;
     * routing them here could track and dispose the same instance twice.
     * Async isolation keeps construction and Promise execution in the module, while shared helpers
     * stay shared. It tracks promises; disposal checks happen later. Async gains still need measuring.
     */
    if (isolatedTransientStrategies !== undefined && descriptor.lifetime === DependencyLifetime.Transient && (keys?.length ?? 0) <= 5)
    {
        runtimeDescriptor.instatiationStrategy = createIsolatedAsyncFactoryStrategy
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
            runtimeDescriptor.instatiationStrategy = createCodeGenerationAsyncFactoryStrategy
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
        runtimeDescriptor.instatiationStrategy = createIsolatedAsyncFactoryStrategy
        (
            collectionRegistrations,
            singularRegistrations,
            descriptor,
            isolatedTransientStrategies
        );

        return;
    }

    // Default: predefined argument-count cases or spread, with the usual lifetime tracking.
    runtimeDescriptor.instatiationStrategy = createPredefinedAsyncFactoryStrategy
    (
        collectionRegistrations,
        singularRegistrations,
        descriptor
    );
}
