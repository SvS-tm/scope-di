import type { DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import { useMemo } from "react";
import { UseDependenciesHook } from "../../types/use-dependencies-hook";
import { useDependencyResolutionKeysVersion } from "./use-dependency-resolution-keys-version";
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

        const keysVersion = useDependencyResolutionKeysVersion(keys);
        const dependencies = useMemo(() => scope.resolveRange(...keys), [scope, keysVersion]);

        return dependencies;
    };
};
