import type { AwaitedResolvedDependencies, DependencyMappingKey, DependencyResolutionKey, ResolvedDependencies, DiScope, RegisteredDependencies } from "@svs-tm/scope-di";
import { type ControlledTrackedPromise, TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { useEffect, useMemo } from "react";
import { NotExpectedAsyncDependencyStateError } from "../../errors/not-expected-async-dependency-state-error";
import type { AsyncResolutionResult, UseDependenciesAsyncHook } from "../../types";
import { asyncResolutionResultMarker } from "../constants/async-resolution-result-marker";
import { DependenciesResolutionTraceResult, traceDependenciesResolution } from "../helpers/di-scope";
import { useDiScope } from "./use-di-scope";

const marker = { [asyncResolutionResultMarker]: true } as const;

type Marked<T_Value> = typeof marker & T_Value;

type DependenciesResolutionResult
<
    T_RegisteredDependencies extends RegisteredDependencies, 
    T_DependencyResolutionKeys extends DependencyResolutionKey<DependencyMappingKey<T_RegisteredDependencies>>[]
> = 
(
    {
        trace: DependenciesResolutionTraceResult.Async,
        dependencies: Marked<ControlledTrackedPromise<AwaitedResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>>>;
    }
        |
    {
        trace: DependenciesResolutionTraceResult.AsyncSettled;
        dependencies: Marked<Promise<ResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>>>;
    }
        |
    {
        trace: DependenciesResolutionTraceResult.Sync;
        dependencies: Marked<Promise<ResolvedDependencies<T_RegisteredDependencies, T_DependencyResolutionKeys>>>;
    }
);

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
        const scope = useDiScope(rootScope);

        const resolution = useMemo<DependenciesResolutionResult<T_RegisteredDependencies, typeof keys>>
        (
            () => 
            {
                const trace = traceDependenciesResolution(scope, ...keys)

                switch (trace)
                {
                    case DependenciesResolutionTraceResult.Sync:
                        return { trace, dependencies: Object.assign(TrackedPromise.resolved(scope.resolve(...keys)), marker) };
                    case DependenciesResolutionTraceResult.Async:
                        return { trace, dependencies: Object.assign(TrackedPromise.controlled<AwaitedResolvedDependencies<T_RegisteredDependencies, typeof keys>>(), marker) };
                    case DependenciesResolutionTraceResult.AsyncSettled:
                    {
                        const dependencies = scope.resolve(...keys);

                        return {
                            trace,
                            dependencies: Object.assign
                            (
                                TrackedPromise.resolved
                                (
                                    dependencies.map
                                    (
                                        (dependency, index) => 
                                        {
                                            const key = keys[index];

                                            if (scope.registry.isAsyncKey(key) && dependency instanceof Promise)
                                            {
                                                const tracked = TrackedPromise.track(dependency);

                                                const status = tracked[TrackedPromise.status];

                                                if (status === TrackedPromiseStatus.Success)
                                                    return tracked[TrackedPromise.value];
                                                else
                                                    throw new NotExpectedAsyncDependencyStateError(key, status);
                                            }

                                            return dependency;
                                        }
                                    ) as ResolvedDependencies<T_RegisteredDependencies, typeof keys>
                                ),
                                marker
                            )
                        };
                    }
                }
            },
            [scope]
        );

        /**
         * @note we need this effect to actually trigger real async injection work
         * only if component was actually committed (effects run only after commit)
         */
        useEffect
        (
            () =>
            {
                async function awaitResolution()
                {
                    if (resolution.trace === DependenciesResolutionTraceResult.Async)
                    {
                        try
                        {
                            const dependencies = await scope.resolveAsync(...keys);

                            resolution.dependencies[TrackedPromise.resolve](dependencies);
                        }
                        catch (error)
                        {
                            resolution.dependencies[TrackedPromise.reject](error);
                        }
                    }
                }

                awaitResolution();
            },
            [resolution, scope]
        );

        return resolution.dependencies as AsyncResolutionResult<T_RegisteredDependencies, typeof keys>;
    };
};
