import { DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import { useDebugValue, useEffect, useState } from "react";
import { resolutionScopeContext } from "../constants/resolution-scope-context";
import { useContextValue } from "./use-context-value";

export type UseDiScopeOptions<T_RegisteredDependencies extends RegisteredDependencies> =
{
    rootScope: DiScope<T_RegisteredDependencies>;
    createNewScope?: boolean | undefined;
};

export const useDiScope = <T_RegisteredDependencies extends RegisteredDependencies>({ rootScope, createNewScope } : UseDiScopeOptions<T_RegisteredDependencies>) =>
{
    const parentScope = useContextValue(resolutionScopeContext) as DiScope<T_RegisteredDependencies> ?? rootScope;

    const [currentScope] = useState(() => createNewScope ? parentScope.createChildScope() : parentScope);

    useEffect
    (
        () => createNewScope
            ? () => currentScope[Symbol.dispose].call(currentScope)
            : undefined,
        []
    );

    useDebugValue(currentScope);

    return currentScope;
};
