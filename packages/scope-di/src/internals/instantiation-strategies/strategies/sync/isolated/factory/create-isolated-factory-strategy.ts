import { createSyncResolver } from "../../create-sync-resolver";
import type * as IsolatedTransientStrategies from "../../../isolated-transient-strategies";
import type { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import type { FactoryDependencyDescriptor } from "../../../../../../types/factory-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";

export function createIsolatedFactoryStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: FactoryDependencyDescriptor<T_Dependency>,
    isolatedTransientStrategies: typeof IsolatedTransientStrategies
)
    : InstantiationStrategy<T_Dependency>
{
    const resolvers = (descriptor.subDependenciesKeys ?? []).map
    (
        key => createSyncResolver(collectionRegistrations, singularRegistrations, key)
    );

    return isolatedTransientStrategies.createFactoryStrategy(descriptor, resolvers);
}
