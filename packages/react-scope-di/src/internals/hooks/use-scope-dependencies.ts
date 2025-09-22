import type { DependencyMappingKey, DependencyResolutionKey, DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import { useState } from "react";

export const useScopeDependencies = 
<
    T_RegisteredDependencies extends RegisteredDependencies, 
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
>
(
    scope: DiScope<T_RegisteredDependencies>, 
    keys: T_DependencyResolutionKeys
) =>
{
    const [dependencies] = useState(() => scope.resolve(...keys));

    return dependencies;
};
