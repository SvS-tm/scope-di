import { describe, expect, it, jest } from "@jest/globals";
import { configureRootScope, DependencyLifetime } from "@svs-tm/scope-di";
import { TrackedPromise, TrackedPromiseStatus } from "@svs-tm/system";
import { act, render, renderHook, screen } from "@testing-library/react";
import { Suspense, type JSX } from "react";
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
            "Key change: resolves dependencies for the latest requested key",
            async () =>
            {
                const dependency1 = { value: "Dependency1" };
                const dependency2 = { value: "Dependency2" };

                const scope = configureRootScope()
                    .map("Key1")
                        .asFactoryAsync(async () => dependency1, DependencyLifetime.Singleton)
                    .map("Key2")
                        .asFactoryAsync(async () => dependency2, DependencyLifetime.Singleton)
                    .build();

                const { useDependenciesAsync } = createReactDiTools(scope);

                const { result, rerender } = renderHook
                (
                    ({ key }) => useDependenciesAsync(key),
                    { initialProps: { key: "Key1" as "Key1" | "Key2" } }
                );

                const promise1 = result.current;
                const [resolvedDependency1] = await act(async () => await result.current);

                expect(resolvedDependency1).toBe(dependency1);

                rerender({ key: "Key2" });

                expect(result.current).not.toBe(promise1);

                const [resolvedDependency2] = await act(async () => await result.current);

                expect(resolvedDependency2).toBe(dependency2);
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
            "Settled async collection: returns an already resolved collection result",
            async () =>
            {
                const key1 = "Key1";
                const originalDependency1 = {};
                const originalDependency2 = {};

                const scope = configureRootScope()
                    .map(key1)
                        .asFactoryAsync(async () => originalDependency1, DependencyLifetime.Singleton)
                    .map(key1)
                        .asFactoryAsync(async () => originalDependency2, DependencyLifetime.Singleton)
                    .build();

                await scope.resolveRangeAsync([key1]);

                const { useDependenciesAsync } = createReactDiTools(scope);

                const { result } = renderHook(() => useDependenciesAsync([key1]));

                expect(getTrackedStatus(result.current)).toBe(TrackedPromiseStatus.Success);

                const [[dependency1, dependency2]] = await result.current;

                expect(dependency1).toBe(originalDependency2);
                expect(dependency2).toBe(originalDependency1);
            }
        );

        it
        (
            "Settled async collection: preserves sync promise values in the collection",
            async () =>
            {
                const key1 = "Key1";
                const syncPromise = Promise.resolve("sync promise value");
                const asyncDependency = {};

                const scope = configureRootScope()
                    .map(key1)
                        .asValue(syncPromise)
                    .map(key1)
                        .asFactoryAsync(async () => asyncDependency, DependencyLifetime.Singleton)
                    .build();

                await scope.resolveRangeAsync([key1]);

                const { useDependenciesAsync } = createReactDiTools(scope);

                const { result } = renderHook(() => useDependenciesAsync([key1]));

                expect(getTrackedStatus(result.current)).toBe(TrackedPromiseStatus.Success);

                const [[dependency1, dependency2]] = await result.current;

                expect(dependency1).toBe(asyncDependency);
                expect(dependency2).toBe(syncPromise);
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
            "Discarded render does not start async dependency resolution",
            async () =>
            {
                const factorySpy = jest.fn(async () => ({ value: "dependency" }));
                const suspendedRender = new Promise(() => undefined);

                const scope = configureRootScope()
                    .map("dependency")
                        .asFactoryAsync(factorySpy, DependencyLifetime.Singleton)
                    .build();

                const { useDependenciesAsync } = createReactDiTools(scope);

                function Consumer(): JSX.Element
                {
                    useDependenciesAsync("dependency");

                    throw suspendedRender;
                }

                render
                (
                    <Suspense fallback={<span data-testid="pending">Pending</span>}>
                        <Consumer />
                    </Suspense>
                );

                expect(screen.getByTestId("pending")).toBeInTheDocument();

                await act(async () => undefined);

                expect(factorySpy).not.toHaveBeenCalled();
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
