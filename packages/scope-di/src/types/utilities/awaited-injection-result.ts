import type { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import type { DependencyMappingKey } from "../dependency-mapping-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { GetDefaultDependencyMetadata } from "./get-default-dependency-metadata";
import type { InjectionResult } from "./injection-result";

export type AwaitedInjectionResult
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>
> = 
(
    GetDefaultDependencyMetadata<T_RegisteredDependencies, T_DependencyMappingKey> extends DependencyDescriptorType.ClassAsync | DependencyDescriptorType.FactoryAsync
        ? InjectionResult<T_RegisteredDependencies, T_DependencyMappingKey> extends Promise<infer T_Awaited> 
            ? T_Awaited 
            : InjectionResult<T_RegisteredDependencies, T_DependencyMappingKey>
        : InjectionResult<T_RegisteredDependencies, T_DependencyMappingKey>
);
