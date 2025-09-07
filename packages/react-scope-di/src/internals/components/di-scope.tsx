import type { DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import type { DiScopeComponent } from "../../types/di-scope-component";
import type { ReactDiOptions } from "../../types/react-di-options";
import { resolutionScopeContext } from "../constants/resolution-scope-context";
import { useDiScope } from "../hooks/use-di-scope";
import { DiContextProvider } from "./di-context-provider";
import { DiErrorBoundary } from "./di-error-boundary";
import { DiSuspense } from "./di-suspense";

export const createDiScopeComponent = <T_RegisteredDependencies extends RegisteredDependencies>
(
    rootScope: DiScope<T_RegisteredDependencies>,
    options?: ReactDiOptions
) : DiScopeComponent =>
{
    return ({ children, error = options?.error, pending = options?.pending }) =>
    {
        const scope = useDiScope({ rootScope, createNewScope: true });

        return (
            <DiContextProvider context={resolutionScopeContext} value={scope}>
                <DiErrorBoundary fallback={error}>
                    <DiSuspense fallback={pending}>
                        {children}
                    </DiSuspense>
                </DiErrorBoundary>
            </DiContextProvider>
        );
    };
};
