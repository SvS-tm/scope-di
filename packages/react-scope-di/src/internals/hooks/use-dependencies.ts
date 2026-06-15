import type { DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import { useState } from "react";
import { UseDependenciesHook } from "../../types/use-dependencies-hook";
import { useDiScope } from "./use-di-scope";

export const createUseDependenciesHook = 
<
    T_RegisteredDependencies extends RegisteredDependencies
>
(
    rootScope: DiScope<T_RegisteredDependencies>
)
    : UseDependenciesHook<T_RegisteredDependencies> =>
{
    return (...keys) =>
    {
        const scope = useDiScope(rootScope);
        const [dependencies] = useState(() => scope.resolveRange(...keys));

        return dependencies;
    };
};
