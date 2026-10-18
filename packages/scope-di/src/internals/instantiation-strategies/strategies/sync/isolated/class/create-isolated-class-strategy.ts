import { createSyncResolver } from "../../create-sync-resolver";
import type * as IsolatedTransientStrategies from "../../../isolated-transient-strategies";
import type { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import type { ClassDependencyDescriptor } from "../../../../../../types/class-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";

export function createIsolatedClassStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: ClassDependencyDescriptor<T_Dependency>,
    isolatedTransientStrategies: typeof IsolatedTransientStrategies
)
    : InstantiationStrategy<T_Dependency>
{
    const resolvers = (descriptor.subDependenciesKeys ?? []).map
    (
        key => createSyncResolver(collectionRegistrations, singularRegistrations, key)
    );

    return isolatedTransientStrategies.createClassStrategy(descriptor, resolvers);
}
