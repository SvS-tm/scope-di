import type { DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";
import { ComponentType } from "react";
import { ResolvedAsyncComponentRenderer } from "./resolved-async-component-renderer";
import { ResolvedComponentOptions } from "./resolved-component-options";

export type ResolveAsyncHoc<T_RegisteredDependencies extends RegisteredDependencies> = 
<
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {} = {}
>
(
    keys: T_DependencyResolutionKeys,
    options: ResolvedComponentOptions<T_Props> | undefined,
    renderer: ResolvedAsyncComponentRenderer<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>
)
    => ComponentType<T_Props>;
