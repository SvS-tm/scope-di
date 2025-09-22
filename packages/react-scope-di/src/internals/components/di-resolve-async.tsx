import type { DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";
import type { ComponentType } from "react";
import type { UseDependenciesAsyncHook } from "../../types";
import type { DiScopeComponent } from "../../types/di-scope-component";
import type { ResolvedAsyncComponentRenderer } from "../../types/resolved-async-component-renderer";
import type { ResolvedComponentOptions } from "../../types/resolved-component-options";
import { DiErrorBoundary } from "./di-error-boundary";
import { DiSuspense } from "./di-suspense";

type AsyncDependenciesProviderProps
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {}
> =
{
    keys: T_DependencyResolutionKeys,
    props: T_Props,
    children: ResolvedAsyncComponentRenderer<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>,
    useDependenciesAsync: UseDependenciesAsyncHook<T_RegisteredDependencies>
};

const AsyncDependenciesProvider = 
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {}
>
(
    {
        keys,
        props, 
        children: Renderer,
        useDependenciesAsync
    }: AsyncDependenciesProviderProps<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>
) =>
{
    const dependencies = useDependenciesAsync(...keys);
    
    return <Renderer props={props} dependencies={dependencies} />;
};

export const diResolveAsync = 
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {} = {}
>
(
    keys: T_DependencyResolutionKeys,
    options: ResolvedComponentOptions<T_Props> | undefined,
    renderer: ResolvedAsyncComponentRenderer<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>,
    DiScope: DiScopeComponent,
    useDependenciesAsync: UseDependenciesAsyncHook<T_RegisteredDependencies>
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
                            <AsyncDependenciesProvider keys={keys} props={props} useDependenciesAsync={useDependenciesAsync}>
                                {renderer}
                            </AsyncDependenciesProvider>
                        </DiScope>
                    </DiSuspense>
                </DiErrorBoundary>
            );
        }
        else
        {
            return (
                <AsyncDependenciesProvider keys={keys} props={props} useDependenciesAsync={useDependenciesAsync}>
                    {renderer}
                </AsyncDependenciesProvider>
            );
        }
    };
};
