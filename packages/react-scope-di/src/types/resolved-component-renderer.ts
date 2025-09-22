import type { DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies, ResolvedDependencies } from "@svs-tm/scope-di";
import type { ElementType } from "react";

export type ResolvedComponentRenderer
<
    T_RegisteredDependencies extends RegisteredDependencies, 
    T_ResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {}
> = 
(
    ElementType<
        {
            props: T_Props;
            dependencies: ResolvedDependencies<T_RegisteredDependencies, T_ResolutionKeys>;
        }
    >
);
