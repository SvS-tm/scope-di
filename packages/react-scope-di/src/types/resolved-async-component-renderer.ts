import type { AwaitedResolvedDependencies, DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";
import type { ElementType } from "react";

export type ResolvedAsyncComponentRenderer
<
    T_RegisteredDependencies extends RegisteredDependencies, 
    T_ResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {}
> = 
(
    ElementType<
        {
            props: T_Props;
            dependencies: AwaitedResolvedDependencies<T_RegisteredDependencies, T_ResolutionKeys>;
        }
    >
);
