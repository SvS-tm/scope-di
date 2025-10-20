import type { DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import type { DiScopeComponent } from "../../types/di-scope-component";
import { resolutionScopeContext } from "../constants/resolution-scope-context";
import { useDiScope } from "../hooks/use-di-scope";
import { DiContextProvider } from "./di-context-provider";

export const createDiScopeComponent = <T_RegisteredDependencies extends RegisteredDependencies>
(
    rootScope: DiScope<T_RegisteredDependencies>
)
    : DiScopeComponent =>
{
    return ({ children }) =>
    {
        const scope = useDiScope({ rootScope, createNewScope: true });

        return (
            <DiContextProvider context={resolutionScopeContext} value={scope}>
                {children}
            </DiContextProvider>
        );
    };
};
