import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { DependenciesCollectionResolutionKey } from "../dependencies-collection-resolution-key";
import type { DependencyDescriptorType } from "../dependency-descriptor-type";
import type { DependencyMetadata } from "../dependency-metadata";
import type { DependencyResolutionKey } from "../dependency-resolution-key";
import type { GetDefaultDependencyMetadata } from "./get-default-dependency-metadata";
import type { GetDependenciesCollectionMetadata } from "./get-dependencies-collection-metadata";

type MetadataToDependencyType<T_MetadataCollection extends DependencyMetadata<any, DependencyDescriptorType>[]> =
(
    {
        [T_Key in keyof T_MetadataCollection]: T_MetadataCollection[T_Key]["dependency"];
    }
);

export type InjectionResult
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyResolutionKey extends DependencyResolutionKey<AllowedDependencyKey>
> = 
(
    T_DependencyResolutionKey extends DependencyResolutionKey<infer T_DependencyMappingKey>
        ? T_DependencyResolutionKey extends DependenciesCollectionResolutionKey<any>
            ? MetadataToDependencyType<GetDependenciesCollectionMetadata<T_RegisteredDependencies, T_DependencyMappingKey>["dependencies"]>
            : GetDefaultDependencyMetadata<T_RegisteredDependencies, T_DependencyMappingKey>["dependency"]
        : never
);
