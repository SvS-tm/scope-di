import type { AwaitedResolvedDependencies, DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";
import type { ComponentType } from "react";
import type { DiScopeComponent } from "../../types/di-scope-component";
import type { ResolvedAsyncComponentRenderer } from "../../types/resolved-async-component-renderer";
import type { ResolvedComponentOptions } from "../../types/resolved-component-options";
import type { UseDependenciesAsyncHook } from "../../types/use-dependencies-async-hook";
import { suspendedAwait } from "../helpers/promise";
import { DiErrorBoundary } from "./di-error-boundary";
import { DiSuspense } from "./di-suspense";

type AsyncDependenciesAwaiterProps
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {}
> =
{
    props: T_Props;
    children: ResolvedAsyncComponentRenderer<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>;
    dependencies: Promise<AwaitedResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>>;
};

const AsyncDependenciesAwaiter =
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {}
>
(
    {
        children: Renderer,
        dependencies,
        props
    } 
        : AsyncDependenciesAwaiterProps<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>
) =>
{
    const awaitedDependencies = suspendedAwait(dependencies);

    return <Renderer dependencies={awaitedDependencies} props={props} />;
};

type AsyncDependenciesProviderProps
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[],
    T_Props extends {}
> =
{
    keys: T_DependencyResolutionKeys;
    props: T_Props;
    options: ResolvedComponentOptions<T_Props> | undefined;
    children: ResolvedAsyncComponentRenderer<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>;
    useDependenciesAsync: UseDependenciesAsyncHook<T_RegisteredDependencies>;
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
        children,
        options,
        useDependenciesAsync
    }
        : AsyncDependenciesProviderProps<T_RegisteredDependencies, T_DependencyResolutionKeys, T_Props>
) =>
{
    const dependencies = useDependenciesAsync(...keys);
    
    return (
        <DiErrorBoundary fallback={options?.error}>
            <DiSuspense fallback={options?.pending}>
                <AsyncDependenciesAwaiter dependencies={dependencies} props={props}>
                    {children}
                </AsyncDependenciesAwaiter>
            </DiSuspense>
        </DiErrorBoundary>
    );
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
                <DiScope>
                    <AsyncDependenciesProvider options={options} keys={keys} props={props} useDependenciesAsync={useDependenciesAsync}>
                        {renderer}
                    </AsyncDependenciesProvider>
                </DiScope>
            );
        }
        else
        {
            return (
                <AsyncDependenciesProvider options={options} keys={keys} props={props} useDependenciesAsync={useDependenciesAsync}>
                    {renderer}
                </AsyncDependenciesProvider>
            );
        }
    };
};
