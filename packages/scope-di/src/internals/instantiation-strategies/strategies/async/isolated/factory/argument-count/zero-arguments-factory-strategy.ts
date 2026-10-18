import { TrackedPromise } from "@svs-tm/system";
import type { AsyncFactoryDependencyDescriptor } from "../../../../../../../types/async-factory-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../../types/instantiation-strategy";

export function createZeroArgumentsAsyncFactoryStrategy<T_Dependency>(descriptor: AsyncFactoryDependencyDescriptor<T_Dependency>): InstantiationStrategy<Promise<T_Dependency>>
{
    const factory = descriptor.factory;
    return scope =>
    {
        const dependency = TrackedPromise.track(factory());
        scope.trackTransientAsyncDependency(dependency);
        return dependency;
    };
}
