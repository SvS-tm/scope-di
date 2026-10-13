import { trackTransientDependency } from "../../../../transient-tracking";
import { DependencyLifetime } from "../../../../../../../types";
import type { ClassDependencyDescriptor } from "../../../../../../../types/class-dependency-descriptor";
import { InstantiationStrategy } from "../../../../../../../types/instantiation-strategy";

export function createZeroArgumentsClassStrategy<T_Dependency>
(
    descriptor: ClassDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<T_Dependency>
{
    const constructor = descriptor.constructor;
    if (descriptor.lifetime === DependencyLifetime.Transient)
    {
        return (scope) =>
        {
            const dependency = new constructor();

            trackTransientDependency(scope, dependency);

            return dependency;
        };
    }

    return () =>
    {
        const dependency = new constructor();

        return dependency;
    };
}
