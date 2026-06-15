import type { AwaitedResolvedDependencies, DependencyMappingKey, DependencyResolutionKey, DiScope, RegisteredDependencies, ResolvedDependencies } from "@svs-tm/scope-di";
import { isAsyncDescriptor } from "@svs-tm/scope-di";
import { type ControlledTrackedPromise, TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { useEffect, useMemo } from "react";
import { NotExpectedAsyncDependencyStateError } from "../../errors/not-expected-async-dependency-state-error";
import type { AsyncResolutionResult, UseDependenciesAsyncHook } from "../../types";
import { asyncResolutionResultMarker } from "../constants/async-resolution-result-marker";
import { DependenciesResolutionTraceResult, traceDependenciesResolution } from "../helpers/di-scope";
import { useDependencyResolutionKeysVersion } from "./use-dependency-resolution-keys-version";
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

function getSettledAsyncDependencyValue
(
    key: DependencyResolutionKey<DependencyMappingKey<RegisteredDependencies>>,
    dependency: Promise<unknown>
)
{
    const tracked = TrackedPromise.track(dependency);
    const status = tracked[TrackedPromise.status];

    if (status === TrackedPromiseStatus.Success)
        return tracked[TrackedPromise.value];
    else
        throw new NotExpectedAsyncDependencyStateError(key, status);
}

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
        const keysVersion = useDependencyResolutionKeysVersion(keys);

        const resolution = useMemo<DependenciesResolutionResult<T_RegisteredDependencies, typeof keys>>
        (
            () => 
            {
                const trace = traceDependenciesResolution(scope, ...keys)

                switch (trace)
                {
                    case DependenciesResolutionTraceResult.Sync:
                        return { trace, dependencies: Object.assign(TrackedPromise.resolved(scope.resolveRange(...keys)), marker) };
                    case DependenciesResolutionTraceResult.Async:
                        return { trace, dependencies: Object.assign(TrackedPromise.controlled<AwaitedResolvedDependencies<T_RegisteredDependencies, typeof keys>>(), marker) };
                    case DependenciesResolutionTraceResult.AsyncSettled:
                    {
                        const dependencies = scope.resolveRange(...keys);

                        return {
                            trace,
                            dependencies: Object.assign
                            (
                                TrackedPromise.resolved
                                (
                                    dependencies.map
                                    (
                                        (dependencyOrCollection, index) => 
                                        {
                                            const key = keys[index];

                                            if (Array.isArray(key) && Array.isArray(dependencyOrCollection))
                                            {
                                                const descriptors = scope.registry.resolveDescriptorsByKey(key);

                                                if (Array.isArray(descriptors))
                                                {
                                                    return dependencyOrCollection.map
                                                    (
                                                        (dependency: unknown, dependencyIndex: number) =>
                                                        {
                                                            const descriptor = descriptors[dependencyIndex];

                                                            if (descriptor && isAsyncDescriptor(descriptor) && dependency instanceof Promise)
                                                                return getSettledAsyncDependencyValue(key, dependency);

                                                            return dependency;
                                                        }
                                                    );
                                                }
                                            }

                                            if (scope.registry.isAsyncKey(key) && dependencyOrCollection instanceof Promise)
                                                return getSettledAsyncDependencyValue(key, dependencyOrCollection);

                                            return dependencyOrCollection;
                                        }
                                    ) as ResolvedDependencies<T_RegisteredDependencies, typeof keys>
                                ),
                                marker
                            )
                        };
                    }
                }
            },
            [scope, keysVersion]
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
                            const dependencies = await scope.resolveRangeAsync(...keys);

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
