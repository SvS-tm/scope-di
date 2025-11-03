import type { DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";
import type { ComponentType } from "react";
import { DiResolutionOptions, UseDependenciesHook } from "../../types";
import { DiScopeComponent } from "../../types/di-scope-component";
import type { ResolvedComponentOptions } from "../../types/resolved-component-options";
import type { ResolvedComponentRenderer } from "../../types/resolved-component-renderer";
import { DiErrorBoundary } from "./di-error-boundary";

type DependenciesProviderProps
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {}
> 
    =
{
    keys: T_DependencyResolutionKeys;
    props: T_Props;
    children: ResolvedComponentRenderer<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>;
    useDependencies: UseDependenciesHook<T_RegisteredDependencies>;
};

function DependenciesProvider
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
        useDependencies
    }
        : DependenciesProviderProps<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>
)
{
    const dependencies = useDependencies(...keys);
    
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
    options: ResolvedComponentOptions<T_Props, DiResolutionOptions> | undefined,
    renderer: ResolvedComponentRenderer<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>,
    DiScope: DiScopeComponent,
    useDependencies: UseDependenciesHook<T_RegisteredDependencies>
) 
    : ComponentType<T_Props> =>
{
    return (props: T_Props) =>
    {
        if (options?.createNewScope)
        {
            return (
                <DiScope>
                    <DiErrorBoundary fallback={options?.error}>
                        <DependenciesProvider keys={keys} props={props} useDependencies={useDependencies}>
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
                    <DependenciesProvider keys={keys} props={props} useDependencies={useDependencies}>
                        {renderer}
                    </DependenciesProvider>
                </DiErrorBoundary>
            );
        }
    };
};
