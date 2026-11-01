import { trackTransientDependency } from "../../../../transient-tracking";
import { DependencyLifetime } from "../../../../../../../types";
import type { FactoryDependencyDescriptor } from "../../../../../../../types/factory-dependency-descriptor";
import type { RuntimeDependencyDescriptor } from "../../../../../../../types/internals/runtime-dependency-descriptor";
import type { AllowedDependencyKey } from "../../../../../../../types/allowed-dependency-key";
import type { InstantiationStrategy } from "../../../../../../../types/instantiation-strategy";
import type { RegisteredDependencies } from "../../../../../../../types/registered-dependencies";
import { DefaultDiScope } from "../../../../../../scope/default-di-scope";

import { createSyncResolver } from "../../../create-sync-resolver";

export function createSpreadArgumentsFactoryStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: FactoryDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<T_Dependency>
{
    const factory = descriptor.factory;
    const keys = descriptor.subDependenciesKeys ?? [];
    const resolvers = keys.map(key => createSyncResolver(collectionRegistrations, singularRegistrations, key));

    if (descriptor.lifetime === DependencyLifetime.Transient)
    {
        return (scope: DefaultDiScope<RegisteredDependencies>) =>
        {
            const dependencies = resolvers.map(resolveDependency => resolveDependency(scope));

            const dependency = factory(...dependencies);

            trackTransientDependency(scope, dependency);

            return dependency;
        };
    }

    return (scope: DefaultDiScope<RegisteredDependencies>) =>
    {
        const dependencies = resolvers.map(resolveDependency => resolveDependency(scope));

        const dependency = factory(...dependencies);

        return dependency;
    };
}

