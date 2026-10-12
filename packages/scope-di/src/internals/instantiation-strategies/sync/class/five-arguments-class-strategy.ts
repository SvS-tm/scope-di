import { DependencyLifetime } from "../../../../types";
import type { ClassDependencyDescriptor } from "../../../../types/class-dependency-descriptor";
import { trackTransientDependency } from "../../transient-tracking";
import { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";

import { createSyncResolver } from "../create-sync-resolver";

export function createFiveArgumentsClassStrategy<T_Dependency>
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
    const resolveDependency3 = createSyncResolver(collectionRegistrations, singularRegistrations, keys[2]);
    const resolveDependency4 = createSyncResolver(collectionRegistrations, singularRegistrations, keys[3]);
    const resolveDependency5 = createSyncResolver(collectionRegistrations, singularRegistrations, keys[4]);

    if (descriptor.lifetime === DependencyLifetime.Transient)
    {
        return (scope) =>
        {
            const dependency = new constructor
            (
                resolveDependency1(scope),
                resolveDependency2(scope),
                resolveDependency3(scope),
                resolveDependency4(scope),
                resolveDependency5(scope)
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
            resolveDependency2(scope),
            resolveDependency3(scope),
            resolveDependency4(scope),
            resolveDependency5(scope)
        );

        return dependency;
    };
}
