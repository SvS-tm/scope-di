import { describe, expect, it } from "@jest/globals";
import { configureRootScope, DependencyDescriptorType, DependencyLifetime, isAsyncDescriptor, type DependencyDescriptor } from "@svs-tm/scope-di";
import { ChancyValue, TrackedPromise } from "@svs-tm/system";
import { DependenciesResolutionTraceResult, traceDependenciesResolution } from "./di-scope";

describe
(
    "traceDependenciesResolution",
    () =>
    {
        it
        (
            "returns AsyncSettled for an uncached async class without sub-dependencies",
            () =>
            {
                class Dependency {}

                const scope = configureRootScope()
                    .map("dependency")
                        .asClassAsync(Dependency, DependencyLifetime.Singleton)
                    .build();

                const result = traceDependenciesResolution(scope, "dependency");

                expect(result).toBe(DependenciesResolutionTraceResult.AsyncSettled);
            }
        );

        it
        (
            "returns AsyncSettled for an uncached async class with sync sub-dependencies",
            () =>
            {
                class Dependency {}
                class Parent
                {
                    public constructor(public readonly dependency: Dependency)
                    {
                    }
                }

                const scope = configureRootScope()
                    .map("dependency")
                        .asClass(Dependency, DependencyLifetime.Singleton)
                    .map("parent")
                        .asDependent("dependency")
                        .classAsync(Parent, DependencyLifetime.Singleton)
                    .build();

                const result = traceDependenciesResolution(scope, "parent");

                expect(result).toBe(DependenciesResolutionTraceResult.AsyncSettled);
            }
        );

        it
        (
            "returns Async for an uncached async class with async sub-dependencies",
            () =>
            {
                class Parent
                {
                    public constructor(public readonly dependency: unknown)
                    {
                    }
                }

                const scope = configureRootScope()
                    .map("dependency")
                        .asFactoryAsync(async () => ({}), DependencyLifetime.Singleton)
                    .map("parent")
                        .asDependent("dependency")
                        .classAsync(Parent, DependencyLifetime.Singleton)
                    .build();

                const result = traceDependenciesResolution(scope, "parent");

                expect(result).toBe(DependenciesResolutionTraceResult.Async);
            }
        );

        it
        (
            "returns Async when an async dependency is already tracked but still pending",
            () =>
            {
                const dependency = TrackedPromise.controlled<object>();

                const scope = configureRootScope()
                    .map("dependency")
                        .asFactoryAsync(() => dependency, DependencyLifetime.Singleton)
                    .build();

                scope.resolve("dependency");

                const result = traceDependenciesResolution(scope, "dependency");

                expect(result).toBe(DependenciesResolutionTraceResult.Async);
            }
        );

        it
        (
            "returns Async when an async descriptor has a cached non-promise value",
            () =>
            {
                const descriptor: DependencyDescriptor =
                {
                    key: "dependency",
                    type: DependencyDescriptorType.FactoryAsync,
                    lifetime: DependencyLifetime.Singleton,
                    factory: async () => ({})
                };

                expect(isAsyncDescriptor(descriptor)).toBe(true);

                const scope =
                {
                    registry:
                    {
                        *resolveDescriptorsByKeys()
                        {
                            yield descriptor;
                        }
                    },
                    findResolvedDependencyByDescriptor: () => ChancyValue.success({})
                } as never;

                const result = traceDependenciesResolution(scope, "dependency" as never);

                expect(result).toBe(DependenciesResolutionTraceResult.Async);
            }
        );
    }
);
