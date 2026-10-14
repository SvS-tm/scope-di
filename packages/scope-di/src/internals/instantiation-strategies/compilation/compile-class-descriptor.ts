import { Logging } from "../../../helpers/internals/logging";
import { createIsolatedClassStrategy } from "../strategies/sync/isolated/class/create-isolated-class-strategy";
import { createPredefinedClassStrategy } from "../strategies/sync/predefined/class/create-predefined-class-strategy";
import type * as IsolatedTransientStrategies from "../strategies/isolated-transient-strategies";
import { Writable } from "@svs-tm/system";
import { DependencyLifetime } from "../../../types/dependency-lifetime";
import type { AllowedDependencyKey } from "../../../types/allowed-dependency-key";
import type { ClassDependencyDescriptor } from "../../../types/class-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../types/internals/runtime-dependency-descriptor";
import { createCodeGenerationClassStrategy } from "../strategies/sync/code-generation/class/code-generation-class-strategy";

export function compileClassDescriptor
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: ClassDependencyDescriptor<unknown, AllowedDependencyKey>,
    allowRuntimeCodeGeneration: boolean,
    isolatedTransientStrategies?: typeof IsolatedTransientStrategies
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
     * Performance measurements led us to shared disposal-symbol checks as a transient-resolution bottleneck.
     * Node/V8 feedback dumps showed megamorphic accesses: one check saw many unrelated object shapes.
     * Code generation could give each descriptor separate feedback, but for small argument counts it
     * mostly duplicated fixed strategy bodies; we did not need dynamically generated source for that.
     * Generating and compiling that source can also add more setup time than loading another instance
     * of the fixed strategy module, potentially moving the bottleneck to container construction.
     * Node documents loading the same module separately when its import query changes:
     * https://nodejs.org/api/esm.html#file-urls
     * We tried this, then switched from file URLs to relative imports because Bun reused the module
     * despite different file-URL queries in our Windows probe (Node 26.11.1, Bun 1.4.2, Deno 2.9.6).
     * Relative imports with unique queries produced separate functions in all three tested runtimes.
     * Separate module bodies gave each descriptor its own feedback sites, which stayed monomorphic
     * for stable object shapes. New closures from the same body did not provide that separation.
     * Sync benchmarks favored full-strategy isolation up to five arguments; changing factory shapes
     * limited the benefit, and async gains remain unmeasured. Codegen remains an option for wider calls.
     * buildAsync loads modules once per transient descriptor; resolution reuses the strategy.
     * Isolation costs loading time and memory, and skips cached lifetimes to avoid double disposal.
     */
    if (isolatedTransientStrategies !== undefined && descriptor.lifetime === DependencyLifetime.Transient && (keys?.length ?? 0) <= 5)
    {
        runtimeDescriptor.instatiationStrategy = createIsolatedClassStrategy
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
            runtimeDescriptor.instatiationStrategy = createCodeGenerationClassStrategy
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
        runtimeDescriptor.instatiationStrategy = createIsolatedClassStrategy
        (
            collectionRegistrations,
            singularRegistrations,
            descriptor,
            isolatedTransientStrategies
        );

        return;
    }

    // Default: predefined argument-count cases or spread, with the usual lifetime tracking.
    runtimeDescriptor.instatiationStrategy = createPredefinedClassStrategy
    (
        collectionRegistrations,
        singularRegistrations,
        descriptor
    );
}
