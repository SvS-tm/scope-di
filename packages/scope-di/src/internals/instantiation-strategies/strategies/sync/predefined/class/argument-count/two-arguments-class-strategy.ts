import { trackTransientDependency } from "../../../../transient-tracking";
import { DependencyLifetime } from "../../../../../../../types";
import type { ClassDependencyDescriptor } from "../../../../../../../types/class-dependency-descriptor";
import { RuntimeDependencyDescriptor } from "../../../../../../../types/internals/runtime-dependency-descriptor";
import { AllowedDependencyKey } from "../../../../../../../types/allowed-dependency-key";
import { InstantiationStrategy } from "../../../../../../../types/instantiation-strategy";

import { createSyncResolver } from "../../../create-sync-resolver";

export function createTwoArgumentsClassStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: ClassDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<T_Dependency>
{
    const constructor = descriptor.constructor;
    const keys = descriptor.subDependenciesKeys ?? [];
    const resolveDependency1 = createSyncResolver(collectionRegistrations, singularRegistrations, keys[0]);
    const resolveDependency2 = createSyncResolver(collectionRegistrations, singularRegistrations, keys[1]);

    if (descriptor.lifetime === DependencyLifetime.Transient)
    {
        return (scope) =>
        {
            const dependency = new constructor
            (
                resolveDependency1(scope),
                resolveDependency2(scope)
            );

            trackTransientDependency(scope, dependency);

            return dependency;
        };
    }

    return (scope) =>
    {
        const dependency = new constructor
        (
            resolveDependency1(scope),
            resolveDependency2(scope)
        );

        return dependency;
    };
}
