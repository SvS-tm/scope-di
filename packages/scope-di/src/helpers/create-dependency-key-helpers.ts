import { dependenciesCollectionType } from "../constants/internals/dependencies-collection-type";
import type { DiScope } from "../scope";
import type { DependencyMappingKey, RegisteredDependencies } from "../types";
import type { DependenciesCollectionResolutionKey } from "../types/dependencies-collection-resolution-key";

export const createDependencyKeyHelpers = 
<
    T_RegisteredDependencies extends RegisteredDependencies
>
(
    _scope: DiScope<T_RegisteredDependencies>
) =>
{
    return {
        keys: <T_DependencyMappingKeys extends DependencyMappingKey<T_RegisteredDependencies>[]>
        (
            ...keys: T_DependencyMappingKeys
        ) =>
        {
            return keys;
        },
        collectionKey: <T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
        (
            key: T_DependencyMappingKey
        )
            : DependenciesCollectionResolutionKey<T_DependencyMappingKey> =>
        {
            return {
                type: dependenciesCollectionType,
                mappingKey: key
            };
        }
    };
};
