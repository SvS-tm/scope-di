import type { DependencyDescriptor } from "../types/dependency-descriptor";
import type { DependencyMappingKey } from "../types/dependency-mapping-key";
import type { DependencyResolutionKey } from "../types/dependency-resolution-key";
import type { RegisteredDependencies } from "../types/registered-dependencies";
import type { AwaitedResolvedDependencies } from "../types/utilities/awaited-resolved-dependencies";
import type { ResolvedDependencies } from "../types/utilities/resolved-dependencies";

export type DiScope<T_RegisteredDependencies extends RegisteredDependencies> = 
(
    Disposable
        &
    AsyncDisposable
        &
    {
        resolve<T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
        (
            ...keys: T_DependencyResolutionKeys
        )
            : ResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>;

        resolveAsync<T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
        (
            ...keys: T_DependencyResolutionKeys
        )
            : Promise<AwaitedResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>>;

        getDescriptors(): readonly Readonly<DependencyDescriptor>[];

        createChildScope(): DiScope<T_RegisteredDependencies>;
    }
);
