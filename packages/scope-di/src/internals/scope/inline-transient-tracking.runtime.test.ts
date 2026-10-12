import { describe, expect, it, jest } from "@jest/globals";
import { DependencyDescriptorType, DependencyLifetime } from "../../types";
import type { DependencyDescriptor } from "../../types";
import { DefaultDiDependenciesRegistry } from "../registry/default-di-dependencies-registry";
import { DefaultDiScope } from "./default-di-scope";

describe
(
    "Inlined transient tracking",
    () =>
    {
        it.each([0, 1, 6].flatMap(count => ["disabled", "generated", "blocked"].map(mode => ({ count, mode }))))
        (
            "tracks class disposal fields with $count arguments when generation is $mode",
            async ({ count, mode }) =>
            {
                const dispose = jest.fn();
                class Target
                {
                    public [Symbol.dispose] = dispose;

                    public constructor(..._arguments: unknown[])
                    {
                    }
                }
                const descriptor: DependencyDescriptor =
                {
                    key: "target",
                    type: DependencyDescriptorType.Class,
                    lifetime: DependencyLifetime.Transient,
                    constructor: Target,
                    subDependenciesKeys: Array.from({ length: count }, () => "argument")
                };
                const registrations = new Map<string, DependencyDescriptor>
                (
                    [
                        ["argument", { key: "argument", type: DependencyDescriptorType.Value, lifetime: DependencyLifetime.Singleton, value: 1 }],
                        ["target", descriptor]
                    ]
                );
                const generation = mode === "blocked"
                    ? jest.spyOn(globalThis, "Function").mockImplementation(() => { throw new EvalError("Blocked by CSP"); })
                    : undefined;
                let registry: DefaultDiDependenciesRegistry;
                try
                {
                    registry = new DefaultDiDependenciesRegistry(registrations, mode !== "disabled");
                }
                finally
                {
                    generation?.mockRestore();
                }
                const compiled = registry.resolveSingularDescriptorByKey("target");
                const scope = new DefaultDiScope(registry);
                const first = scope.resolveByDescriptor(compiled);
                const second = scope.resolveByDescriptor(compiled);
                expect(first).not.toBe(second);
                await scope[Symbol.asyncDispose]();
                expect(dispose).toHaveBeenCalledTimes(2);
            }
        );

        it.each(["disabled", "generated", "blocked"])
        (
            "preserves per-instance disposal detection when generation is %s",
            async mode =>
            {
                const syncDispose = jest.fn();
                const asyncDispose = jest.fn(async () => {});
                const unusedSyncDispose = jest.fn();
                const disposableFunction = Object.assign(() => {}, { [Symbol.dispose]: syncDispose });
                const values =
                [
                    {},
                    42,
                    disposableFunction,
                    { [Symbol.dispose]: syncDispose },
                    { [Symbol.asyncDispose]: asyncDispose, [Symbol.dispose]: unusedSyncDispose }
                ];
                let index = 0;
                const descriptor: DependencyDescriptor =
                {
                    key: "factory",
                    type: DependencyDescriptorType.Factory,
                    lifetime: DependencyLifetime.Transient,
                    factory: () => values[index++]
                };
                const generation = mode === "blocked"
                    ? jest.spyOn(globalThis, "Function").mockImplementation(() => { throw new EvalError("Blocked by CSP"); })
                    : undefined;
                let registry: DefaultDiDependenciesRegistry;
                try
                {
                    registry = new DefaultDiDependenciesRegistry(new Map([["factory", descriptor]]), mode !== "disabled");
                }
                finally
                {
                    generation?.mockRestore();
                }
                const compiled = registry.resolveSingularDescriptorByKey("factory");
                const scope = new DefaultDiScope(registry);
                for (const value of values)
                    expect(scope.resolveByDescriptor(compiled)).toBe(value);
                expect(syncDispose).not.toHaveBeenCalled();
                await scope[Symbol.asyncDispose]();
                expect(syncDispose).toHaveBeenCalledTimes(2);
                expect(asyncDispose).toHaveBeenCalledTimes(1);
                expect(unusedSyncDispose).not.toHaveBeenCalled();
            }
        );

        it
        (
            "generates separate source for each instantiation strategy",
            () =>
            {
                const registrations = new Map<string, DependencyDescriptor>();
                for (const key of ["first", "second"])
                    registrations.set(key, { key, type: DependencyDescriptorType.Factory, lifetime: DependencyLifetime.Transient, factory: () => ({}) });
                const registry = new DefaultDiDependenciesRegistry(registrations, true);
                const first = registry.resolveSingularDescriptorByKey("first").instatiationStrategy;
                const second = registry.resolveSingularDescriptorByKey("second").instatiationStrategy;
                expect(first.toString()).not.toBe(second.toString());
            }
        );

        it
        (
            "keeps async descriptors on promise tracking",
            async () =>
            {
                const dispose = jest.fn();
                const descriptor: DependencyDescriptor =
                {
                    key: "asyncFactory",
                    type: DependencyDescriptorType.FactoryAsync,
                    lifetime: DependencyLifetime.Transient,
                    factory: async () => ({ [Symbol.dispose]: dispose })
                };
                const registry = new DefaultDiDependenciesRegistry(new Map([["asyncFactory", descriptor]]), true);
                const compiled = registry.resolveSingularDescriptorByKey("asyncFactory");
                const scope = new DefaultDiScope(registry);
                await scope.resolveByDescriptor(compiled);
                await scope[Symbol.asyncDispose]();
                expect(dispose).toHaveBeenCalledTimes(1);
            }
        );
    }
);
