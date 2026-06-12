import { describe, expect, it } from "@jest/globals";
import { configureRootScope, DependencyLifetime } from "@svs-tm/scope-di";
import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { act, renderHook } from "@testing-library/react";
import { createReactDiTools } from "./create-react-di-tools";

class ParentDependency
{
    public constructor(public readonly dependency: { readonly value: string; })
    {
    }
}

const getTrackedStatus = <T_Result,>(promise: Promise<T_Result>) =>
{
    return (promise as TrackedPromise<T_Result>)[TrackedPromise.status];
};

describe
(
    "useDependenciesAsync", 
    () => 
    {
        it
        (
            "Returns stable promise after re-render", 
            () => 
            {
                const key1 = "Key1";
                const originalDependency1 = {};

                const scope = configureRootScope()
                    .map(key1)
                        .asFactoryAsync(async () => originalDependency1, DependencyLifetime.Singleton)
                    .build();

                const { useDependenciesAsync } = createReactDiTools(scope);

                const { result, rerender } = renderHook(() => useDependenciesAsync(key1));
                
                const promise1 = result.current;

                rerender();

                const promise2 = result.current;

                expect(promise1).toBe(promise2);
            }
        );

        it
        (
            "Mixed sync/async keys: after resolve, values are returned in the reverse key order and awaited", 
            async () => 
            {
                const key1 = "Key1";
                const originalDependency1 = {};
                const originalDependency2 = {};
                const originalDependency3 = {};

                const scope = configureRootScope()
                    .map(key1)
                        .asFactoryAsync(async () => originalDependency1, DependencyLifetime.Singleton)
                    .map(key1)
                        .asValue(originalDependency2)
                    .map(key1)
                        .asFactoryAsync(async () => originalDependency3, DependencyLifetime.Singleton)
                    .build();

                const { useDependenciesAsync } = createReactDiTools(scope);

                const { result: { current: promise } } = renderHook(() => useDependenciesAsync([key1]));
                
                const [[dependency1, dependency2, dependency3]] = await act(async () => await promise);

                expect(dependency1).toBe(originalDependency3);
                expect(dependency2).toBe(originalDependency2);
                expect(dependency3).toBe(originalDependency1);
            }
        );

        it
        (
            "ClassAsync with sync dependencies returns an already resolved result",
            async () =>
            {
                const dependency = { value: "dependency" };

                const scope = configureRootScope()
                    .map("dependency")
                        .asValue(dependency)
                    .map("parent")
                        .asDependent("dependency")
                        .classAsync(ParentDependency, DependencyLifetime.Singleton)
                    .build();

                const { useDependenciesAsync } = createReactDiTools(scope);

                const { result } = renderHook(() => useDependenciesAsync("parent"));

                expect(getTrackedStatus(result.current)).toBe(TrackedPromiseStatus.Success);

                const [parent] = await result.current;

                expect(parent).toBeInstanceOf(ParentDependency);
                expect(parent.dependency).toBe(dependency);
            }
        );

        it
        (
            "ClassAsync with settled async dependencies returns an already resolved result",
            async () =>
            {
                const dependency = { value: "dependency" };

                const scope = configureRootScope()
                    .map("dependency")
                        .asFactoryAsync(async () => dependency, DependencyLifetime.Singleton)
                    .map("parent")
                        .asDependent("dependency")
                        .classAsync(ParentDependency, DependencyLifetime.Singleton)
                    .build();

                await scope.resolveAsync("dependency");

                const { useDependenciesAsync } = createReactDiTools(scope);

                const { result } = renderHook(() => useDependenciesAsync("parent"));

                expect(getTrackedStatus(result.current)).toBe(TrackedPromiseStatus.Success);

                const [parent] = await result.current;

                expect(parent).toBeInstanceOf(ParentDependency);
                expect(parent.dependency).toBe(dependency);
            }
        );

        it
        (
            "Rejects when async dependency resolution rejects",
            async () =>
            {
                const error = new Error("Dependency rejected");

                const scope = configureRootScope()
                    .map("dependency")
                        .asFactoryAsync(async () => Promise.reject(error), DependencyLifetime.Singleton)
                    .build();

                const { useDependenciesAsync } = createReactDiTools(scope);

                const { result } = renderHook(() => useDependenciesAsync("dependency"));

                await expect(act(async () => await result.current)).rejects.toBe(error);
            }
        );
    }
);
