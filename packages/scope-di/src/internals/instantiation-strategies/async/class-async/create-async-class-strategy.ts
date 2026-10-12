import { DependencyLifetime } from "../../../../types";
import type { AsyncClassDependencyDescriptor } from "../../../../types/async-class-dependency-descriptor";
import { throwError, TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { resolveAsyncDependencies } from "../resolve-async-dependencies";
import { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import { DependencyNotRegisteredError } from "../../../../errors";

export function createAsyncClassStrategy<T_Dependency>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    descriptor: AsyncClassDependencyDescriptor<T_Dependency>,
    subStrategy: (dependencies: unknown[]) => T_Dependency
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    const keys = descriptor.subDependenciesKeys ?? [];
    const decsriptorsBuckets = keys.map
    (
        (key) => Array.isArray(key) 
            ? (collectionRegistrations.get(key[0]) ?? throwError<RuntimeDependencyDescriptor[]>(new DependencyNotRegisteredError(key[0])))
            : (singularRegistrations.get(key) ?? throwError<RuntimeDependencyDescriptor>(new DependencyNotRegisteredError(key)))
    );

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
             * @note Class constructor can't have async work, so we can safely wrap it in resolved tracked promise here
             */
            const dependency = TrackedPromise.resolved(subStrategy(promise[TrackedPromise.value]));

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
         * @note Class constructor can't have async work, so we can safely wrap it in resolved tracked promise here
         */
        const dependency = TrackedPromise.resolved(subStrategy(promise[TrackedPromise.value]));

        return dependency;
    };
}
