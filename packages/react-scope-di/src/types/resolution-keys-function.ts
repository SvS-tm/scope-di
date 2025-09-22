import { DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";

export type ResolutionKeysFunction<T_RegisteredDependencies extends RegisteredDependencies> = 
(
    <T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]>
    (
        ...keys: T_DependencyResolutionKeys
    ) 
        => T_DependencyResolutionKeys
);
