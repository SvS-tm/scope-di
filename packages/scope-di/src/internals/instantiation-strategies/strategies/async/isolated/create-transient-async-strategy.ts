import type { PromiseWrappingStrategy } from "../../../../../types/promise-wrapping-strategy";
import type { ConstructionStrategy } from "../../../../../types/construction-strategy";
import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { resolveAsyncDependencies } from "../resolve-async-dependencies";
import type { RuntimeDependencyDescriptor } from "../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../types/instantiation-strategy";

/** Keep this execution body exclusive to the isolated entry to retain per-module feedback sites. */
export function createTransientAsyncStrategy<T_Dependency>
(
    buckets: (RuntimeDependencyDescriptor | RuntimeDependencyDescriptor[])[],
    instantiate: ConstructionStrategy<T_Dependency | Promise<T_Dependency>>,
    wrapSettled: PromiseWrappingStrategy<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    return scope =>
    {
        const dependencies = resolveAsyncDependencies(scope, buckets);
        const dependency = dependencies[TrackedPromise.status] === TrackedPromiseStatus.Success
            ? wrapSettled(instantiate(dependencies[TrackedPromise.value]))
            : TrackedPromise.track((async () => instantiate(await dependencies))());

        scope.trackTransientAsyncDependency(dependency);

        return dependency;
    };
}
