import { DependencyLifetime } from "../../../../types";
import type { FactoryDependencyDescriptor } from "../../../../types/factory-dependency-descriptor";
import { trackTransientDependency } from "../../transient-tracking";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";

export function createZeroArgumentsFactoryStrategy<T_Dependency>
(
    descriptor: FactoryDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<T_Dependency>
{
    const factory = descriptor.factory;
    if (descriptor.lifetime === DependencyLifetime.Transient)
    {
        return (scope) =>
        {
            const dependency = factory();

            trackTransientDependency(scope, dependency);

            return dependency;
        };
    }

    return () =>
    {
        const dependency = factory();

        return dependency;
    };
}
