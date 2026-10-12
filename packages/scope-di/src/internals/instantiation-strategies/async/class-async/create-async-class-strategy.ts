import { throwError, TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { DependencyMappingKey } from "../../../../types/dependency-mapping-key";
import { DependencyResolutionKey } from "../../../../types/dependency-resolution-key";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";
import { RegisteredDependencies } from "../../../../types/registered-dependencies";
import { resolveAsyncDependencies } from "../resolve-async-dependencies";
import { AllowedDependencyKey } from "../../../../types/allowed-dependency-key";
import { RuntimeDependencyDescriptor } from "../../../../types/internals/runtime-dependency-descriptor";
import { DependencyNotRegisteredError } from "../../../../errors";

export function createAsyncClassStrategy<T_Dependency, T_RegisteredDependencies extends RegisteredDependencies>
(
    collectionRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor[]>,
    singularRegistrations: Map<AllowedDependencyKey, RuntimeDependencyDescriptor>,
    keys: DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    subStrategy: (dependencies: unknown[]) => T_Dependency
)
    : InstantiationStrategy<Promise<T_Dependency>>
{
    const decsriptorsBuckets = keys.map
    (
        (key) => Array.isArray(key) 
            ? (collectionRegistrations.get(key[0]) ?? throwError<RuntimeDependencyDescriptor[]>(new DependencyNotRegisteredError(key[0])))
            : (singularRegistrations.get(key) ?? throwError<RuntimeDependencyDescriptor>(new DependencyNotRegisteredError(key)))
    );

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
    
            return TrackedPromise.track(resolveAsync());
        }
    
        /**
         * @note Class constructor can't have async work, so we can safely wrap it in resolved tracked promise here
         */
        return TrackedPromise.resolved(subStrategy(promise[TrackedPromise.value]));
    };
}
