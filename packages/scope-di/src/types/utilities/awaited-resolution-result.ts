import type { DependencyDescriptorType } from "../dependency-descriptor-type";
import type { RegisteredDependencies } from "../registered-dependencies";
import type { DependenciesCollectionMetadata } from "../dependencies-collection-metadata";
import { DependenciesCollectionResolutionKey } from "../dependencies-collection-resolution-key";
import type { DependencyMappingKey } from "../dependency-mapping-key";
import type { DependencyMetadata } from "../dependency-metadata";
import type { DependencyResolutionKey } from "../dependency-resolution-key";
import { GetDefaultDependencyMetadata } from "./get-default-dependency-metadata";
import type { GetDependenciesCollectionMetadata } from "./get-dependencies-collection-metadata";
import type { ResolutionResult } from "./resolution-result";
import type { IsAsyncDependencyDescriptorType } from "./is-async-dependency-descriptor-type";
import type { BoxedPromiseDependency } from "../boxed-promise-dependency";

type AnyIsAsyncMetada<T_DependencyMetadata extends DependencyMetadata<any, DependencyDescriptorType>> =
(
    T_DependencyMetadata extends DependencyMetadata<any, infer T_DependencyDescriptorType>
        ? IsAsyncDependencyDescriptorType<T_DependencyDescriptorType> extends false
            ? false
            : true
        : false
);

type IsAsyncCollectionMetadata<T_DependencyCollectionMetadata extends DependenciesCollectionMetadata<any, any>> =
(
    T_DependencyCollectionMetadata extends DependenciesCollectionMetadata<any, infer T_Dependencies>
        ? AnyIsAsyncMetada<T_Dependencies[number]> extends false
            ? false
            : true
        : false
);

type MetadataToAwaitedDependencyType
<
    T_DependencyMetadata extends DependencyMetadata<any, DependencyDescriptorType>,
    T_WrapSyncPromise extends boolean
> =
(
    IsAsyncDependencyDescriptorType<T_DependencyMetadata["type"]> extends true
        ? T_DependencyMetadata["dependency"] extends Promise<infer T_Dependency>
            ? T_Dependency
            : T_DependencyMetadata["dependency"]
        : T_WrapSyncPromise extends true
            ? T_DependencyMetadata["dependency"] extends Promise<unknown>
                ? BoxedPromiseDependency<T_DependencyMetadata["dependency"]>
                : T_DependencyMetadata["dependency"]
            : T_DependencyMetadata["dependency"]
);

type MetadataCollectionToAwaitedDependencyType<T_MetadataCollection extends DependencyMetadata<any, DependencyDescriptorType>[]> =
(
    {
        [T_Key in keyof T_MetadataCollection]: MetadataToAwaitedDependencyType<T_MetadataCollection[T_Key], false>;
    }
);

export type AwaitedResolutionResult
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyResolutionKey extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>,
    T_WrapSyncPromise extends boolean = false
> = 
(
    T_DependencyResolutionKey extends DependenciesCollectionResolutionKey<infer T_DependencyMappingKey>
        ? IsAsyncCollectionMetadata<GetDependenciesCollectionMetadata<T_RegisteredDependencies, T_DependencyMappingKey>> extends true
            ? MetadataCollectionToAwaitedDependencyType<GetDependenciesCollectionMetadata<T_RegisteredDependencies, T_DependencyMappingKey>["dependencies"]>
            : ResolutionResult<T_RegisteredDependencies, T_DependencyResolutionKey>
        : T_DependencyResolutionKey extends DependencyMappingKey<T_RegisteredDependencies>
            ? MetadataToAwaitedDependencyType<GetDefaultDependencyMetadata<T_RegisteredDependencies, T_DependencyResolutionKey>, T_WrapSyncPromise>
            : ResolutionResult<T_RegisteredDependencies, T_DependencyResolutionKey>
);
