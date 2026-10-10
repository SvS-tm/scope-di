import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { resolveAsyncDependencies } from "../resolve-async-dependencies";

export function createAsyncFactoryStrategy<T_Dependency, T_RegisteredDependencies extends RegisteredDependencies>
(
    keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    subStrategy: (dependencies: unknown[]) => Promise<T_Dependency>
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    return (scope) =>
    {
        const promise = resolveAsyncDependencies(scope, keys);

        if (promise[TrackedPromise.status] !== TrackedPromiseStatus.Success)
        {
            const resolveAsync = async () =>
            {
                const dependencies = await promise;

                return subStrategy(dependencies);
            };

            return TrackedPromise.track(resolveAsync());
        }

        /**
         * @note factory can have async work, so we can't reliably say if promise was resolved already or no...
         * So lets just track it
         */
        return TrackedPromise.track(subStrategy(promise[TrackedPromise.value]));
    };
}

