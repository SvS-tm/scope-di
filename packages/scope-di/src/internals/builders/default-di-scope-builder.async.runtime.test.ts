import { describe, expect, it, jest } from "@jest/globals";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import { DependencyNotRegisteredError } from "../../errors/dependency-not-registered-error";

jest.mock("./load-isolated-transient-strategy-modules", () => ({ loadIsolatedTransientStrategyModules: jest.fn() }));
const { loadIsolatedTransientStrategyModules } = require("./load-isolated-transient-strategy-modules") as typeof import("./load-isolated-transient-strategy-modules");
const { DefaultDiScopeBuilder } = require("./default-di-scope-builder") as typeof import("./default-di-scope-builder");

describe
(
    "DefaultDiScopeBuilder async initialization",
    () =>
    {
        it
        (
            "waits for isolated strategy loading before compiling the scope",
            async () =>
            {
                let finish!: (value: Map<never, never>) => void;
                const pending = new Promise<Map<never, never>>(resolve => { finish = resolve; });
                const prepare = jest.mocked(loadIsolatedTransientStrategyModules).mockReturnValue(pending);
                let completed = false;
                const building = new DefaultDiScopeBuilder().setAllowRuntimeModuleIsolation(true).build().then(scope =>
                {
                    completed = true;
                    return scope;
                });
                await Promise.resolve();
                expect(completed).toBe(false);
                expect(prepare).toHaveBeenCalledTimes(1);
                finish(new Map<never, never>());
                await building;
                expect(completed).toBe(true);
            }
        );

        it
        (
            "falls back without isolation when module loading fails",
            async () =>
            {
                const error = new Error("Strategy module missing");
                const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
                jest.mocked(loadIsolatedTransientStrategyModules).mockRejectedValue(error);
                let disposals = 0;
                const builder = new DefaultDiScopeBuilder()
                    .setAllowRuntimeCodeGeneration(false)
                    .setAllowRuntimeModuleIsolation(true)
                    .map("dependency").asFactory
                    (
                        () => ({ [Symbol.dispose]() { disposals++; } }),
                        DependencyLifetime.Transient
                    );
                const scope = await builder.build();

                expect(warn).toHaveBeenCalledTimes(1);
                expect(warn).toHaveBeenCalledWith("[scope-di] Module isolation failed; continuing without isolation.", error);
                expect(scope.resolve("dependency")).not.toBe(scope.resolve("dependency"));
                scope[Symbol.dispose]();
                expect(disposals).toBe(2);
            }
        );
        it
        (
            "keeps code generation enabled after module loading fails",
            async () =>
            {
                jest.mocked(loadIsolatedTransientStrategyModules).mockRejectedValue(new Error("Import denied"));
                jest.spyOn(console, "warn").mockImplementation(() => {});
                const generate = jest.spyOn(globalThis, "Function");
                const scope = await new DefaultDiScopeBuilder()
                    .setAllowRuntimeModuleIsolation(true)
                    .setAllowRuntimeCodeGeneration(true)
                    .map("dependency").asFactory(() => ({}), DependencyLifetime.Transient)
                    .build();

                expect(generate).toHaveBeenCalled();
                expect(scope.resolve("dependency")).not.toBe(scope.resolve("dependency"));
            }
        );
        it
        (
            "still rejects invalid registrations after module loading fails",
            async () =>
            {
                jest.mocked(loadIsolatedTransientStrategyModules).mockRejectedValue(new Error("Import denied"));
                jest.spyOn(console, "warn").mockImplementation(() => {});
                const builder = new DefaultDiScopeBuilder()
                    .setAllowRuntimeModuleIsolation(true)
                    .map("dependency").asDependent("missing" as never).factory(value => value, DependencyLifetime.Transient);

                await expect(builder.build()).rejects.toBeInstanceOf(DependencyNotRegisteredError);
            }
        );
        it
        (
            "creates strategies from the loaded module before resolution",
            async () =>
            {
                const createFactoryStrategy = jest.fn();
                const actualStrategies = require("../instantiation-strategies/strategies/isolated-transient-strategies") as typeof import("../instantiation-strategies/strategies/isolated-transient-strategies");
                const strategyModule: typeof actualStrategies =
                {
                    ...actualStrategies,
                    createFactoryStrategy: (descriptor, resolvers) =>
                    {
                        createFactoryStrategy();
                        return actualStrategies.createFactoryStrategy(descriptor, resolvers);
                    }
                };
                const load = jest.mocked(loadIsolatedTransientStrategyModules).mockImplementation
                (
                    async descriptors => new Map(Array.from(descriptors, descriptor => [descriptor, strategyModule]))
                );
                const builder = new DefaultDiScopeBuilder()
                    .setAllowRuntimeModuleIsolation(true)
                    .map("first").asFactory(() => ({}), DependencyLifetime.Transient)
                    .map("second").asDependent("first").factory(first => ({ first }), DependencyLifetime.Transient);
                const scope = await builder.build();
                expect(createFactoryStrategy).toHaveBeenCalledTimes(2);
                load.mockClear();
                createFactoryStrategy.mockClear();
                scope.resolve("second");
                scope.resolve("second");
                expect(createFactoryStrategy).not.toHaveBeenCalled();
                expect(load).not.toHaveBeenCalled();
            }
        );
        it.each([false])
        (
            "does not load modules when isolation is %s",
            async enabled =>
            {
                const builder = new DefaultDiScopeBuilder();
                if (enabled !== undefined)
                    builder.setAllowRuntimeModuleIsolation(enabled);
                await builder.build();
                expect(loadIsolatedTransientStrategyModules).not.toHaveBeenCalled();
            }
        );
    }
);
