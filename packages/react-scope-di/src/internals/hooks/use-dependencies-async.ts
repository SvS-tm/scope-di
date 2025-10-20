import type { DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import { useState } from "react";
import type { UseDependenciesAsyncHook } from "../../types";
import { useDiScope } from "./use-di-scope";

export const createUseDependenciesAsyncHook = 
<
    T_RegisteredDependencies extends RegisteredDependencies
>
(
    rootScope: DiScope<T_RegisteredDependencies>
)
    : UseDependenciesAsyncHook<T_RegisteredDependencies> =>
{
    return (...keys) =>
    {
        const scope = useDiScope({ rootScope });
        const [dependencies] = useState(() => scope.resolveAsync(...keys));

        return dependencies;
    };
};
