import type { ConstructionStrategy } from "../../../../../../types/construction-strategy";
import { TrackedPromise } from "@svs-tm/system";
import { createTransientAsyncStrategy } from "../create-transient-async-strategy";
import { createAsyncDescriptorBuckets } from "../../create-async-descriptor-buckets";
import type { AsyncClassDependencyDescriptor } from "../../../../../../types/async-class-dependency-descriptor";
import type { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import type { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";

export function createAsyncClassExecutionStrategy<T_Dependency>
(
    collections: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singles: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncClassDependencyDescriptor<T_Dependency>,
    construction: ConstructionStrategy<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    const buckets = createAsyncDescriptorBuckets(collections, singles, descriptor.subDependenciesKeys ?? []);


    // Class construction is synchronous once its dependencies have settled.
    return createTransientAsyncStrategy(buckets, construction, value => TrackedPromise.resolved(value as T_Dependency));
}
