import { trackTransientDependency } from "../../../../transient-tracking";
import { DependencyLifetime } from "../../../../../../../types";
import type { FactoryDependencyDescriptor } from "../../../../../../../types/factory-dependency-descriptor";
import { RuntimeDependencyDescriptor } from "../../../../../../../types/internals/runtime-dependency-descriptor";
import { AllowedDependencyKey } from "../../../../../../../types/allowed-dependency-key";
import { InstantiationStrategy } from "../../../../../../../types/instantiation-strategy";

import { createSyncResolver } from "../../../create-sync-resolver";

export function createOneArgumentFactoryStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: FactoryDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<T_Dependency>
{
    const factory = descriptor.factory;
    const keys = descriptor.subDependenciesKeys ?? [];
    const [key] = keys;

    const resolveDependency = createSyncResolver(collectionRegistrations, singularRegistrations, key);

    if (descriptor.lifetime === DependencyLifetime.Transient)
    {
        return (scope) =>
        {
            const dependency = factory
            (
                resolveDependency(scope)
            );

            trackTransientDependency(scope, dependency);

            return dependency;
        };
    }

    return (scope) =>
    {
        const dependency = factory
        (
            resolveDependency(scope)
        );

        return dependency;
    };
}
