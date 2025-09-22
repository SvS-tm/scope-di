import type { DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";
import type { ComponentType } from "react";
import { UseDependenciesHook } from "../../types";
import { DiScopeComponent } from "../../types/di-scope-component";
import type { ResolvedComponentOptions } from "../../types/resolved-component-options";
import type { ResolvedComponentRenderer } from "../../types/resolved-component-renderer";
import { DiErrorBoundary } from "./di-error-boundary";
import { DiSuspense } from "./di-suspense";

const provideDependencies = 
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {}
>
(
    keys: T_DependencyResolutionKeys,
    props: T_Props,
    renderer: ResolvedComponentRenderer<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>,
    useDependencies: UseDependenciesHook<T_RegisteredDependencies>
) =>
{
    const dependencies = useDependencies(...keys);
    const Renderer = renderer;

    return <Renderer props={props} dependencies={dependencies} />;
};

export const diResolve = 
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {} = {}
>
(
    keys: T_DependencyResolutionKeys,
    options: ResolvedComponentOptions<T_Props> | undefined,
    renderer: ResolvedComponentRenderer<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>,
    DiScope: DiScopeComponent,
    useDependencies: UseDependenciesHook<T_RegisteredDependencies>
) : ComponentType<T_Props> =>
{
    return (props: T_Props) =>
    {
        if (options?.createNewScope)
        {
            return (
                <DiErrorBoundary fallback={options?.error}>
                    <DiSuspense fallback={options?.pending}>
                        <DiScope error={options?.error} pending={options?.pending}>
                            {provideDependencies(keys, props, renderer, useDependencies)}
                        </DiScope>
                    </DiSuspense>
                </DiErrorBoundary>
            );
        }
        else
            return provideDependencies(keys, props, renderer, useDependencies);
    };
};
