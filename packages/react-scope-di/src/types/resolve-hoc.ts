import type { DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";
import { ResolvedComponentOptions } from "./resolved-component-options";
import { ResolvedComponentRenderer } from "./resolved-component-renderer";
import { ComponentType } from "react";

export type ResolveHoc<T_RegisteredDependencies extends RegisteredDependencies> = 
<
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {} = {}
>
(
    keys: T_DependencyResolutionKeys,
    options: ResolvedComponentOptions<T_Props> | undefined,
    renderer: ResolvedComponentRenderer<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>
)
    => ComponentType<T_Props>;
