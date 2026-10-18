import type { ConstructionStrategy } from "../../../../../../types/construction-strategy";
import { TrackedPromise } from "@svs-tm/system";
import { createTransientAsyncStrategy } from "../create-transient-async-strategy";
import { createAsyncDescriptorBuckets } from "../../create-async-descriptor-buckets";
import type { AsyncFactoryDependencyDescriptor } from "../../../../../../types/async-factory-dependency-descriptor";
import type { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import type { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";

export function createAsyncFactoryExecutionStrategy<T_Dependency>
(
    collections: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singles: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncFactoryDependencyDescriptor<T_Dependency>,
    construction: ConstructionStrategy<Promise<T_Dependency>>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    const buckets = createAsyncDescriptorBuckets(collections, singles, descriptor.subDependenciesKeys ?? []);


    /**
     * @note factory can have async work, so we can't reliably say if promise was resolved already or no...
     * So lets just track it
     */
    return createTransientAsyncStrategy(buckets, construction, value => TrackedPromise.track(value as Promise<T_Dependency>));
}
