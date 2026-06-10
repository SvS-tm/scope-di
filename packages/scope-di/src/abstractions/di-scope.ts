import { ChancyValue } from "@svs-tm/system";
import type { DependencyMappingKey } from "../types/dependency-mapping-key";
import type { DependencyResolutionKey } from "../types/dependency-resolution-key";
import type { RegisteredDependencies } from "../types/registered-dependencies";
import type { AwaitedResolvedDependencies } from "../types/utilities/awaited-resolved-dependencies";
import type { ResolvedDependencies } from "../types/utilities/resolved-dependencies";
import { DiDependenciesRegistry } from "./di-dependencies-registry";
import { DependencyDescriptor } from "../types";

export type DiScope<T_RegisteredDependencies extends RegisteredDependencies> = 
(
    Disposable
        &
    AsyncDisposable
        &
    {
        readonly registry: DiDependenciesRegistry;

        findResolvedDependencyByDescriptor(descriptor: DependencyDescriptor): ChancyValue<unknown>;

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

        createChildScope(): DiScope<T_RegisteredDependencies>;
    }
);
