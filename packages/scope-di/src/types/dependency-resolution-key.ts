import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependenciesCollectionResolutionKey } from "./dependencies-collection-resolution-key";
import { DependencyMappingKey } from "./dependency-mapping-key";
import { RegisteredDependencies } from "./registered-dependencies";

export type DependencyResolutionKey<T_DependencyMappingKey extends AllowedDependencyKey> = 
    T_DependencyMappingKey | DependenciesCollectionResolutionKey<T_DependencyMappingKey>;

export namespace DependencyResolutionKey
{
    export function equal
    (
        left: DependencyResolutionKey<DependencyMappingKey<RegisteredDependencies>>, 
        right: DependencyResolutionKey<DependencyMappingKey<RegisteredDependencies>>
    )
    {
        const isLeftCollectionKey = Array.isArray(left);
        const isRightCollectionKey = Array.isArray(right);

        if(isLeftCollectionKey != isRightCollectionKey)
            return false;

        if (isLeftCollectionKey)
            return left[0] === right[0];

        return Object.is(left, right);
    }

    export function equalRange
    (
        left: DependencyResolutionKey<DependencyMappingKey<RegisteredDependencies>>[], 
        right: DependencyResolutionKey<DependencyMappingKey<RegisteredDependencies>>[]
    )
    {
        if(left.length !== right.length)
            return false;

        for(let index = 0; index < left.length; ++index)
        {
            if(!equal(left[index], right[index]))
                return false;
        }

        return true;
    }
}
