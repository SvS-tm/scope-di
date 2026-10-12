import { isSafeReference } from "@svs-tm/system";
import type { DefaultDiScope } from "../scope/default-di-scope";
import type { RegisteredDependencies } from "../../types/registered-dependencies";

export function trackTransientDependency(scope: DefaultDiScope<RegisteredDependencies>, dependency: unknown)
{
    if (isSafeReference((dependency as Partial<AsyncDisposable>)[Symbol.asyncDispose]))
        scope.addAsyncDisposableDependency(dependency as AsyncDisposable);
    else if (isSafeReference((dependency as Partial<Disposable>)[Symbol.dispose]))
        scope.addDisposableDependency(dependency as Disposable);
}

