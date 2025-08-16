import { DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import { useEffect, useState } from "react";
import { resolutionScopeContext } from "../constants/resolution-scope-context";
import { useContextValue } from "./use-context-value";

export type UseDiScopeOptions<T_RegisteredDependencies extends RegisteredDependencies> =
{
    rootScope: DiScope<T_RegisteredDependencies>;
    createNewScope?: boolean;
};

export const useDiScope = <T_RegisteredDependencies extends RegisteredDependencies>({ rootScope, createNewScope } : UseDiScopeOptions<T_RegisteredDependencies>) =>
{
    const parentScope = useContextValue(resolutionScopeContext) ?? rootScope;

    const [currentScope] = useState(() => createNewScope ? parentScope.createChildScope() : parentScope);

    useEffect
    (
        () => createNewScope
            ? currentScope[Symbol.dispose]
            : undefined,
        []
    );

    return currentScope;
};
