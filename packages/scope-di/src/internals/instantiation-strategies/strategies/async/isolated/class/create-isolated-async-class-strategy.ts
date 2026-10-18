import type * as IsolatedTransientStrategies from "../../../isolated-transient-strategies";
import type { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import type { AsyncClassDependencyDescriptor } from "../../../../../../types/async-class-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";

export function createIsolatedAsyncClassStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncClassDependencyDescriptor<T_Dependency>,
    isolatedTransientStrategies: typeof IsolatedTransientStrategies
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    return isolatedTransientStrategies.createAsyncClassStrategy
    (
        collectionRegistrations,
        singularRegistrations,
        descriptor
    );
}
