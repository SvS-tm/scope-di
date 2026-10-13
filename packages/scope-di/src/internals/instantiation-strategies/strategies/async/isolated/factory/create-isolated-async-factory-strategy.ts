import type * as IsolatedTransientStrategies from "../../../isolated-transient-strategies";
import type { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import type { AsyncFactoryDependencyDescriptor } from "../../../../../../types/async-factory-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";

export function createIsolatedAsyncFactoryStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncFactoryDependencyDescriptor<T_Dependency>,
    isolatedTransientStrategies: typeof IsolatedTransientStrategies
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    return isolatedTransientStrategies.createAsyncFactoryStrategy
    (
        collectionRegistrations,
        singularRegistrations,
        descriptor
    );
}
