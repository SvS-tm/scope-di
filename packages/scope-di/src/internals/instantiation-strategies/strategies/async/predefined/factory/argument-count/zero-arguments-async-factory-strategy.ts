import { DependencyLifetime } from "../../../../../../../types";
import type { AsyncFactoryDependencyDescriptor } from "../../../../../../../types/async-factory-dependency-descriptor";
import { TrackedPromise } from "@svs-tm/system";
import { InstantiationStrategy } from "../../../../../../../types/instantiation-strategy";

export function createZeroArgumentsAsyncFactoryStrategy<T_Dependency>
(
    descriptor: AsyncFactoryDependencyDescriptor<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    const factory = descriptor.factory;
    /**
     * @note factory can have async work, so we can't reliably say if promise was resolved already or no...
     * So lets just track it
     */
    if (descriptor.lifetime === DependencyLifetime.Transient)
    {
        return (scope) =>
        {
            const dependency = TrackedPromise.track(factory());

            scope.trackTransientAsyncDependency(dependency);

            return dependency;
        };
    }

    return () =>
    {
        const dependency = TrackedPromise.track(factory());

        return dependency;
    };
}

