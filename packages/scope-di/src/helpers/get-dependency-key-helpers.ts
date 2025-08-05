import { dependenciesCollectionType } from "../constants/internals/dependencies-collection-type";
import type { DiScope } from "../scope";
import type { DependencyMappingKey, RegisteredDependencies } from "../types";
import type { DependenciesCollectionResolutionKey } from "../types/dependencies-collection-resolution-key";

const helpers = Object.freeze
(
    {
        keys: <T_DependencyMappingKeys extends DependencyMappingKey<RegisteredDependencies>[]>
        (
            ...keys: T_DependencyMappingKeys
        ) =>
        {
            return keys;
        },
        collectionKey: <T_DependencyMappingKey extends DependencyMappingKey<RegisteredDependencies>>
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
    }
);

export type DependencyKeyHelpers<T_RegisteredDependencies extends RegisteredDependencies> = 
{
    keys<T_DependencyMappingKeys extends DependencyMappingKey<T_RegisteredDependencies>[]>
    (
        ...keys: T_DependencyMappingKeys
    )
        : T_DependencyMappingKeys;

    collectionKey<T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
    (
        key: T_DependencyMappingKey
    )
        : DependenciesCollectionResolutionKey<T_DependencyMappingKey>;
};

export const getDependencyKeyHelpers = 
<
    T_RegisteredDependencies extends RegisteredDependencies
>
(
    _scope: DiScope<T_RegisteredDependencies>
): DependencyKeyHelpers<T_RegisteredDependencies> =>
{
    return helpers;
};
