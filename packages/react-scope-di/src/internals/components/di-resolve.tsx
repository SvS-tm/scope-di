import type { DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";
import type { ComponentType } from "react";
import { UseDependenciesHook } from "../../types";
import { DiScopeComponent } from "../../types/di-scope-component";
import type { ResolvedComponentOptions } from "../../types/resolved-component-options";
import type { ResolvedComponentRenderer } from "../../types/resolved-component-renderer";
import { DiErrorBoundary } from "./di-error-boundary";
import { DiSuspense } from "./di-suspense";

type DependenciesProviderProps
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {}
> =
{
    keys: T_DependencyResolutionKeys;
    props: T_Props;
    options: ResolvedComponentOptions<T_Props> | undefined;
    children: ResolvedComponentRenderer<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>;
    useDependencies: UseDependenciesHook<T_RegisteredDependencies>;
};

const DependenciesProvider = 
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {}
>
(
    {
        keys,
        props, 
        options,
        children: Renderer,
        useDependencies
    }: DependenciesProviderProps<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>
) =>
{
    const dependencies = useDependencies(...keys);
    
    return (
        <DiSuspense fallback={options?.pending}>
            <Renderer props={props} dependencies={dependencies} />
        </DiSuspense>
    );
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
                <DiScope>
                    <DiErrorBoundary fallback={options?.error}>
                        <DependenciesProvider options={options} keys={keys} props={props} useDependencies={useDependencies}>
                            {renderer}
                        </DependenciesProvider>
                    </DiErrorBoundary>
                </DiScope>
            );
        }
        else
        {
            return (
                <DiErrorBoundary fallback={options?.error}>
                    <DependenciesProvider options={options} keys={keys} props={props} useDependencies={useDependencies}>
                        {renderer}
                    </DependenciesProvider>
                </DiErrorBoundary>
            );
        }
    };
};
