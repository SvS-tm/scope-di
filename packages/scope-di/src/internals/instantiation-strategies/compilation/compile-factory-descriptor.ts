import { Logging } from "../../../helpers/internals/logging";
import { createIsolatedFactoryStrategy } from "../strategies/sync/isolated/factory/create-isolated-factory-strategy";
import { createPredefinedFactoryStrategy } from "../strategies/sync/predefined/factory/create-predefined-factory-strategy";
import type * as IsolatedTransientStrategies from "../strategies/isolated-transient-strategies";
import { Writable } from "@svs-tm/system";
import { DependencyLifetime } from "../../../types/dependency-lifetime";
import type { AllowedDependencyKey } from "../../../types/allowed-dependency-key";
import type { FactoryDependencyDescriptor } from "../../../types/factory-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../types/internals/runtime-dependency-descriptor";
import { createCodeGenerationFactoryStrategy } from "../strategies/sync/code-generation/factory/code-generation-factory-strategy";

export function compileFactoryDescriptor
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: FactoryDependencyDescriptor<unknown, AllowedDependencyKey>, 
    allowRuntimeCodeGeneration: boolean,
    isolatedTransientStrategies?: typeof IsolatedTransientStrategies
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
     * Disposal checks stay inside each strategy; importing a shared detector would share its feedback.
     */
    if (isolatedTransientStrategies !== undefined && descriptor.lifetime === DependencyLifetime.Transient && (keys?.length ?? 0) <= 5)
    {
        runtimeDescriptor.instatiationStrategy = createIsolatedFactoryStrategy
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
     * Sync transient disposal checks are inline, giving each descriptor its own property-access
     * feedback instead of sending different shapes through one detector.
     */
    if (allowRuntimeCodeGeneration && ((descriptor.lifetime === DependencyLifetime.Transient) || (keys?.length ?? 0) > 5))
    {
        try
        {
            runtimeDescriptor.instatiationStrategy = createCodeGenerationFactoryStrategy
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
             * Continue with an isolated strategy when available, otherwise the handwritten fallback.
             * Generated bodies track inline; fallback strategies must still register disposable transients.
              */
        }
    }

    /**
     * @note If generation is disabled or blocked, retain module isolation for transient descriptors.
     * Larger argument counts still use spread here; isolation and unrolled calls are separate benefits.
      */
    if (isolatedTransientStrategies !== undefined && descriptor.lifetime === DependencyLifetime.Transient)
    {
        runtimeDescriptor.instatiationStrategy = createIsolatedFactoryStrategy
        (
            collectionRegistrations,
            singularRegistrations,
            descriptor,
            isolatedTransientStrategies
        );

        return;
    }

    // Default: predefined argument-count cases or spread, with the usual lifetime tracking.
    runtimeDescriptor.instatiationStrategy = createPredefinedFactoryStrategy
    (
        collectionRegistrations,
        singularRegistrations,
        descriptor
    );
}
