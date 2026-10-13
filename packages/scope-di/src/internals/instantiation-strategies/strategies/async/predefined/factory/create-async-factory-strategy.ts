import type { ConstructionStrategy } from "../../../../../../types/construction-strategy";
import { createAsyncDescriptorBuckets } from "../../create-async-descriptor-buckets";
import { DependencyLifetime } from "../../../../../../types";
import type { AsyncFactoryDependencyDescriptor } from "../../../../../../types/async-factory-dependency-descriptor";
import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { InstantiationStrategy } from "../../../../../../types/instantiation-strategy";
import { resolveAsyncDependencies } from "../../resolve-async-dependencies";
import { AllowedDependencyKey } from "../../../../../../types/allowed-dependency-key";
import { RuntimeDependencyDescriptor } from "../../../../../../types/internals/runtime-dependency-descriptor";

export function createAsyncFactoryStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncFactoryDependencyDescriptor<T_Dependency>,
    subStrategy: ConstructionStrategy<Promise<T_Dependency>>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    const keys = descriptor.subDependenciesKeys ?? [];
    const decsriptorsBuckets = createAsyncDescriptorBuckets(collectionRegistrations, singularRegistrations, keys);

    if (descriptor.lifetime === DependencyLifetime.Transient)
    {
        return (scope) =>
        {
            const promise = resolveAsyncDependencies(scope, decsriptorsBuckets);

            if (promise[TrackedPromise.status] !== TrackedPromiseStatus.Success)
            {
                const resolveAsync = async () =>
                {
                    const dependencies = await promise;

                    return subStrategy(dependencies);
                };

                const dependency = TrackedPromise.track(resolveAsync());

                scope.trackTransientAsyncDependency(dependency);

                return dependency;
            }

            /**
             * @note factory can have async work, so we can't reliably say if promise was resolved already or no...
             * So lets just track it
             */
            const dependency = TrackedPromise.track(subStrategy(promise[TrackedPromise.value]));

            scope.trackTransientAsyncDependency(dependency);

            return dependency;
        };
    }

    return (scope) =>
    {
        const promise = resolveAsyncDependencies(scope, decsriptorsBuckets);

        if (promise[TrackedPromise.status] !== TrackedPromiseStatus.Success)
        {
            const resolveAsync = async () =>
            {
                const dependencies = await promise;

                return subStrategy(dependencies);
            };

            const dependency = TrackedPromise.track(resolveAsync());

            return dependency;
        }

        /**
         * @note factory can have async work, so we can't reliably say if promise was resolved already or no...
         * So lets just track it
         */
        const dependency = TrackedPromise.track(subStrategy(promise[TrackedPromise.value]));

        return dependency;
    };
}

