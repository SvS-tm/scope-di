import type { DependenciesCollectionResolutionKey } from "../types/dependencies-collection-resolution-key";
import type { DependencyDescriptor } from "../types/dependency-descriptor";
import type { DependencyMappingKey } from "../types/dependency-mapping-key";
import type { DependencyResolutionKey } from "../types/dependency-resolution-key";
import type { RegisteredDependencies } from "../types/registered-dependencies";
import type { AwaitedResolutionResult } from "../types/utilities/awaited-resolution-result";
import type { AwaitedResolvedDependencies } from "../types/utilities/awaited-resolved-dependencies";
import type { ResolutionResult } from "../types/utilities/resolution-result";
import type { ResolvedDependencies } from "../types/utilities/resolved-dependencies";

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
