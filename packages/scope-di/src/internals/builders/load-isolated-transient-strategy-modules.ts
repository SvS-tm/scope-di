import { generateIdentifier } from "../../helpers/internals/identifier-helpers";
import { isolatedTransientStrategyModulePath } from "virtual:isolated-transient-strategy-module-path";
import { DependencyDescriptorType, DependencyLifetime } from "../../types";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import type * as IsolatedTransientStrategies from "../instantiation-strategies/strategies/isolated-transient-strategies";

/**
 * Loads one strategy module instance per transient descriptor, using a unique query on the
 * Rollup-emitted relative chunk path. Resolution reuses the resulting strategy without importing again.
 * See compileClassDescriptor for the strategy-selection rationale and runtime observations.
 * Application bundlers must preserve this import and deploy the chunk; browser deployment is untested.
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
