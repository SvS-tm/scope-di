import type { DependencyMappingKey, DependencyResolutionKey, RegisteredDependencies } from "@svs-tm/scope-di";
import type { DiAwaitProps } from "../../types/di-await-component";
import { suspendedAwait } from "../helpers/promise";
import { isAsyncResultionResult } from "../helpers/is-async-resolution-result";
import { NotExpectedResultTypeError } from "../../errors/not-expected-result-type-error";
import type { UseDependenciesAsyncHook } from "../../types";

export const DiAwait = 
<
    T_RegisteredDependencies extends RegisteredDependencies, 
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
>
(
    { result, children }: DiAwaitProps<T_RegisteredDependencies, T_DependencyResolutionKeys>
) =>
{
    /**
     * @note We want to support only values returned from {@link UseDependenciesAsyncHook}
     */
    if (!isAsyncResultionResult(result))
        throw new NotExpectedResultTypeError(result);

    const awaitedResult = suspendedAwait(result);

    return <>{children(awaitedResult)}</>;
};
