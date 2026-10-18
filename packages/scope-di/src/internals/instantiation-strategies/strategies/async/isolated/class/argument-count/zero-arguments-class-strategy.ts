import { TrackedPromise } from "@svs-tm/system";
import type { AsyncClassDependencyDescriptor } from "../../../../../../../types/async-class-dependency-descriptor";
import type { InstantiationStrategy } from "../../../../../../../types/instantiation-strategy";

export function createZeroArgumentsAsyncClassStrategy<T_Dependency>(descriptor: AsyncClassDependencyDescriptor<T_Dependency>): InstantiationStrategy<Promise<T_Dependency>>
{
    const constructor = descriptor.constructor;
    return scope =>
    {
        const dependency = TrackedPromise.resolved(new constructor());
        scope.trackTransientAsyncDependency(dependency);
        return dependency;
    };
}
