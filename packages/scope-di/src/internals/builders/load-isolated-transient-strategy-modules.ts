import { generateIdentifier } from "../../helpers/internals/identifier-helpers";
import { isolatedTransientStrategyModulePath } from "virtual:isolated-transient-strategy-module-path";
import { DependencyDescriptorType, DependencyLifetime } from "../../types";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import type * as IsolatedTransientStrategies from "../instantiation-strategies/strategies/isolated-transient-strategies";

/**
 * Loads a separate strategy module instance for each transient class or factory, including async ones.
 * Rollup emits one chunk containing these strategy bodies. The file stays the same, but a unique
 * query parameter gives each descriptor a different import URL and therefore its own module instance.
 * The returned map lets compilation create the strategy from that instance. Resolution reuses the
 * resulting closure; it does not load another module on each call.
 * Rollup supplies the emitted chunk path through a virtual module. Both ESM and CommonJS builds
 * load the ESM strategy chunk; the loader does not hardcode its filename or extension.
 * URL-based module identity is described in the HTML module map specification and Node's ESM docs:
 * https://html.spec.whatwg.org/multipage/webappapis.html#module-map
 * https://nodejs.org/api/esm.html#file-urls
 * These rules describe separate module instances, not how an engine shares JIT feedback.
 *
 * This started with transient disposal checks. Removing the shared symbol checks in experiments
 * made deep-chain resolution much faster. V8 feedback dumps showed why: the shared detector saw
 * many unrelated object shapes and became megamorphic. Separate module instances gave descriptors
 * separate feedback sites, which stayed monomorphic when each descriptor returned a stable shape.
 * Creating new closures from the same function body did not provide that separation.
 *
 * Node benchmarks showed that isolating the full strategy worked better than isolating only the
 * disposal detector. Changing shapes within one factory still limited the benefit; async gains have
 * not been measured yet. Isolation can be disabled because loading and retaining module instances has a cost.
 * Cached lifetimes are skipped: they already retain instances and check disposal during cleanup.
 * The isolated bodies track transients, so using them for cached instances could cause double disposal.
 *
 * Tested on Windows with Node 26.11.1, Bun 1.4.2, and Deno 2.9.6:
 * - Repeating the same relative import URL reused the exported function in all three runtimes.
 * - Different query parameters produced different exported functions in all three runtimes.
 * - Node and Deno also distinguished file URLs with different queries. Bun reused the instance
 *   in that probe, so this loader uses a relative path. This is an observation for the tested version.
 *
 * Ignore directives keep application bundlers from rewriting the import, but do not deploy the chunk.
 * Browser deployments must serve it at this path, accept the query, and allow the module under CSP.
 * Browser deployment is not yet tested.
 */
export async function loadIsolatedTransientStrategyModules(descriptors: Iterable<DependencyDescriptor>)
{
    const strategyModules = new Map<DependencyDescriptor, typeof IsolatedTransientStrategies>();

    for (const descriptor of descriptors)
    {
        if (descriptor.lifetime !== DependencyLifetime.Transient)
            continue;

        if (descriptor.type !== DependencyDescriptorType.Class && descriptor.type !== DependencyDescriptorType.Factory
            && descriptor.type !== DependencyDescriptorType.ClassAsync && descriptor.type !== DependencyDescriptorType.FactoryAsync)
            continue;

        const module: typeof IsolatedTransientStrategies = await import
        (
            /* @vite-ignore */
            /* webpackIgnore: true */
            `${isolatedTransientStrategyModulePath}?id=${generateIdentifier()}`
        );
        strategyModules.set(descriptor, module);
    }

    return strategyModules;
}
