import type { DependencyMappingKey, DependencyResolutionKey, DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import { useState } from "react";
import { suspendedAwait } from "../helpers/promise";

export const useScopeDependenciesAsync = 
<
    T_RegisteredDependencies extends RegisteredDependencies, 
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
>
(
    scope: DiScope<T_RegisteredDependencies>, 
    keys: T_DependencyResolutionKeys
) =>
{
    const [promise] = useState(() => scope.resolveAsync(...keys));

    return suspendedAwait(promise);
};
