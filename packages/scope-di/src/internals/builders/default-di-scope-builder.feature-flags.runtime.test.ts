import { describe, expect, it, jest } from "@jest/globals";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import type { FeatureFlag } from "../../types/feature-flag";

jest.mock("./load-isolated-transient-strategy-modules", () => ({ loadIsolatedTransientStrategyModules: jest.fn() }));
const { loadIsolatedTransientStrategyModules } = require("./load-isolated-transient-strategy-modules") as typeof import("./load-isolated-transient-strategy-modules");
const { DefaultDiScopeBuilder } = require("./default-di-scope-builder") as typeof import("./default-di-scope-builder");

describe
(
    "Builder feature flags",
    () =>
    {
        it
        (
            "enables both features on a new builder",
            async () =>
            {
                const load = jest.mocked(loadIsolatedTransientStrategyModules).mockResolvedValue(new Map());
                const generate = jest.spyOn(globalThis, "Function");
                await new DefaultDiScopeBuilder()
                    .map("dependency").asFactory(() => ({}), DependencyLifetime.Transient)
                    .buildAsync();

                expect(load).toHaveBeenCalledTimes(1);
                expect(generate).toHaveBeenCalledTimes(1);
            }
        );

        it.each<FeatureFlag>([true, false, "auto"])
        (
            "selects code generation for %s",
            value =>
            {
                const create = jest.spyOn(globalThis, "Function");
                const dependency = {};
                const builder = new DefaultDiScopeBuilder();
                expect(builder.setAllowRuntimeCodeGeneration(value)).toBe(builder);
                const scope = builder.map("dependency").asFactory(() => dependency, DependencyLifetime.Transient).build();

                expect(scope.resolve("dependency")).toBe(dependency);
                expect(create).toHaveBeenCalledTimes(value !== false ? 1 : 0);
            }
        );

        it.each<FeatureFlag>([true, false, "auto"])
        (
            "selects module isolation for %s",
            async value =>
            {
                const load = jest.mocked(loadIsolatedTransientStrategyModules).mockResolvedValue(new Map());
                const builder = new DefaultDiScopeBuilder();
                expect(builder.setAllowRuntimeModuleIsolation(value)).toBe(builder);
                await builder.buildAsync();

                expect(load).toHaveBeenCalledTimes(value !== false ? 1 : 0);
            }
        );

        it
        (
            "auto restores enabled defaults after explicit disabling",
            async () =>
            {
                jest.mocked(loadIsolatedTransientStrategyModules).mockResolvedValue(new Map());
                const create = jest.spyOn(globalThis, "Function");
                const builder = new DefaultDiScopeBuilder()
                    .setAllowRuntimeCodeGeneration(false)
                    .setAllowRuntimeModuleIsolation(false)
                    .setAllowRuntimeCodeGeneration("auto")
                    .setAllowRuntimeModuleIsolation("auto")
                    .map("dependency").asFactory(() => ({}), DependencyLifetime.Transient);

                await builder.buildAsync();
                expect(create).toHaveBeenCalled();
                expect(loadIsolatedTransientStrategyModules).toHaveBeenCalledTimes(1);
            }
        );
    }
);
