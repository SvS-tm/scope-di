import { DependencyLifetime } from "../../../../types";
import type { AsyncClassDependencyDescriptor } from "../../../../types/async-class-dependency-descriptor";
import { TrackedPromise } from "@svs-tm/system";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";

export function createZeroArgumentsAsyncClassStrategy<T_Dependency>
(
    descriptor: AsyncClassDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    const constructor = descriptor.constructor;
    if (descriptor.lifetime === DependencyLifetime.Transient)
    {
        return (scope) =>
        {
            const dependency = TrackedPromise.resolved(new constructor());

            scope.trackTransientAsyncDependency(dependency);

            return dependency;
        };
    }

    return () =>
    {
        const dependency = TrackedPromise.resolved(new constructor());

        return dependency;
    };
}
