import { describe, expect, it } from "@jest/globals";
import { configureRootScope } from "@svs-tm/scope-di";
import { renderHook } from "@testing-library/react";
import { createReactDiTools } from "./create-react-di-tools";

describe
(
    "useDependencies",
    () => 
    {
        it
        (
            "Multiple keys: returns values in the order requested", 
            () => 
            {
                const key1 = "Key1";
                const key2 = "Key2";
                const key3 = "Key3";
                const originalDependency1 = {};
                const originalDependency2 = {};
                const originalDependency3 = {};

                const scope = configureRootScope()
                    .map(key1)
                        .asValue(originalDependency1)
                    .map(key2)
                        .asValue(originalDependency2)
                    .map(key3)
                        .asValue(originalDependency3)
                    .build();

                const { useDependencies } = createReactDiTools(scope);

                const { result: { current: [dependency1, dependency3, dependency2] } } = renderHook(() => useDependencies(key1, key3, key2));
                
                expect(originalDependency1).toBe(dependency1);
                expect(originalDependency2).toBe(dependency2);
                expect(originalDependency3).toBe(dependency3);
            }
        );

        it
        (
            "Key change: resolves dependencies for the latest requested key",
            () =>
            {
                const dependency1 = { value: "Dependency1" };
                const dependency2 = { value: "Dependency2" };

                const scope = configureRootScope()
                    .map("Key1")
                        .asValue(dependency1)
                    .map("Key2")
                        .asValue(dependency2)
                    .build();

                const { useDependencies } = createReactDiTools(scope);

                const { result, rerender } = renderHook
                (
                    ({ key }) => useDependencies(key),
                    { initialProps: { key: "Key1" as "Key1" | "Key2" } }
                );

                expect(result.current).toEqual([dependency1]);

                rerender({ key: "Key2" });

                expect(result.current).toEqual([dependency2]);
            }
        );

        it
        (
            "Reverse registration order: registering A, then B, then C under the same key resolves as [C, B, A]",
            () =>
            {
                const key1 = "Key1";
                const originalDependency1 = {};
                const originalDependency2 = {};
                const originalDependency3 = {};
                
                const scope = configureRootScope()
                    .map(key1)
                        .asValue(originalDependency1)
                    .map(key1)
                        .asValue(originalDependency2)
                    .map(key1)
                        .asValue(originalDependency3)
                    .build();

                const { useDependencies } = createReactDiTools(scope);
                
                const { result: { current: [[dependency1, dependency2, dependency3]] } } = renderHook(() => useDependencies([key1]));

                expect(originalDependency3).toBe(dependency1);
                expect(originalDependency2).toBe(dependency2);
                expect(originalDependency1).toBe(dependency3);
            }
        );

        it
        (
            "Duplicates included: if the same instance is registered twice, both entries are present",
            () =>
            {
                const key1 = "Key1";
                const value1 = "Value1";

                const dependency = { value: value1 };

                const scope = configureRootScope()
                    .map(key1)
                        .asValue(dependency)
                    .map(key1)
                        .asValue(dependency)
                    .build();

                const { useDependencies } = createReactDiTools(scope);

                const { result: { current: [[dependency1, dependency2]] } } = renderHook(() => useDependencies([key1]));

                expect(dependency1).toBe(dependency);
                expect(dependency2).toBe(dependency);
            }
        );
    }
);
