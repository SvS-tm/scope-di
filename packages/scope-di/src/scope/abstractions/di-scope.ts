import { AwaitedResolvedDependencies, AwaitedResolutionResult, DependencyResolutionKey, ResolvedDependencies } from "../../types";
import type { DependenciesCollectionResolutionKey } from "../../types/dependencies-collection-resolution-key";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import type { DependencyMappingKey } from "../../types/dependency-mapping-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { ResolutionResult } from "../../types/utilities/resolution-result";

export type DiScope<T_RegisteredDependencies extends RegisteredDependencies> = 
(
    Disposable
        &
    AsyncDisposable
        &
    {
        resolve<T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
        (
            key: T_DependencyMappingKey
        )
            : ResolutionResult<T_RegisteredDependencies, T_DependencyMappingKey>;

        resolve<T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
        (
            key: DependenciesCollectionResolutionKey<T_DependencyMappingKey>
        )
            : ResolutionResult<T_RegisteredDependencies, DependenciesCollectionResolutionKey<T_DependencyMappingKey>>;

        resolve<T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
        (
            ...keys: T_DependencyResolutionKeys
        )
            : ResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>;

        resolveAsync<T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
        (
            key: T_DependencyMappingKey
        )
            : Promise<AwaitedResolutionResult<T_RegisteredDependencies, T_DependencyMappingKey>>;

        resolveAsync<T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
        (
            key: DependenciesCollectionResolutionKey<T_DependencyMappingKey>
        )
            : Promise<AwaitedResolutionResult<T_RegisteredDependencies, DependenciesCollectionResolutionKey<T_DependencyMappingKey>>>;

        resolveAsync<T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
        (
            ...keys: T_DependencyResolutionKeys
        )
            : Promise<AwaitedResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>>;

        getDescriptors(): readonly Readonly<DependencyDescriptor>[];

        createChildScope(): DiScope<T_RegisteredDependencies>;
    }
);
