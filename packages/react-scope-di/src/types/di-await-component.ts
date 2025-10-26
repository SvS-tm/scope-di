import { AwaitedResolvedDependencies, DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";
import { ReactNode, JSX } from "react";
import { AsyncResolutionResult } from "./async-resolution-result";

export type DiAwaitProps
<
    T_RegisteredDependencies extends RegisteredDependencies, 
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
>
    = 
{
    result: AsyncResolutionResult<T_RegisteredDependencies, T_DependencyResolutionKeys>;
    children: (awaited: AwaitedResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>) => ReactNode;
};

export type DiAwaitComponent = 
{
    <
        T_RegisteredDependencies extends RegisteredDependencies, 
        T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
    >
    (
        props: DiAwaitProps<T_RegisteredDependencies, T_DependencyResolutionKeys>
    )
        : JSX.Element;
};
