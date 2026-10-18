import { describe, expect, it, jest } from "@jest/globals";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import type { FeatureFlag } from "../../types/feature-flag";

jest.mock("./load-isolated-transient-strategy-modules", () => ({ loadIsolatedTransientStrategyModules: jest.fn() }));
const { loadIsolatedTransientStrategyModules } = require("./load-isolated-transient-strategy-modules") as typeof import("./load-isolated-transient-strategy-modules");
const { configureRootScope } = require("../../helpers/configure-root-scope") as typeof import("../../helpers/configure-root-scope");

describe
(
    "Builder feature flags",
    () =>
    {
        it
        (
            "builds synchronously with both optimizations disabled by default",
            () =>
            {
                const generate = jest.spyOn(globalThis, "Function");
                const scope = configureRootScope()
                    .map("dependency").asFactory(() => ({}), DependencyLifetime.Transient)
                    .build();

                expect(scope).not.toBeInstanceOf(Promise);
                expect(scope.resolve("dependency")).not.toBe(scope.resolve("dependency"));
                expect(generate).not.toHaveBeenCalled();
                expect(loadIsolatedTransientStrategyModules).not.toHaveBeenCalled();
            }
        );

        it.each([true, false])
        (
            "selects code generation for %s without changing the synchronous build contract",
            enabled =>
            {
                const generate = jest.spyOn(globalThis, "Function");
                const dependency = {};
                const scope = configureRootScope()
                    .setAllowRuntimeCodeGeneration(enabled)
                    .map("dependency").asFactory(() => dependency, DependencyLifetime.Transient)
                    .build();

                expect(scope).not.toBeInstanceOf(Promise);
                expect(scope.resolve("dependency")).toBe(dependency);
                expect(generate).toHaveBeenCalledTimes(enabled ? 1 : 0);
            }
        );

        it
        (
            "keeps code generation auto synchronous when isolation is disabled",
            () =>
            {
                const scope = configureRootScope().setAllowRuntimeCodeGeneration("auto").build();
                expect(scope).not.toBeInstanceOf(Promise);
                expect(loadIsolatedTransientStrategyModules).not.toHaveBeenCalled();
            }
        );

        it.each<FeatureFlag>([true, false, "auto"])
        (
            "matches the build return shape for isolation %s",
            async flag =>
            {
                const load = jest.mocked(loadIsolatedTransientStrategyModules).mockResolvedValue(new Map());
                const building = configureRootScope()
                    .setAllowRuntimeModuleIsolation(flag)
                    .map("value").asValue(42)
                    .build();

                expect(building instanceof Promise).toBe(flag !== false);
                const scope = await building;
                expect(scope.resolve("value")).toBe(42);
                if (flag === false)
                    expect(load).not.toHaveBeenCalled();
                else if (flag === true)
                    expect(load).toHaveBeenCalledTimes(1);
            }
        );

        it.each([true, "auto"] as const)
        (
            "keeps isolation %s asynchronous when loading fails and preserves disposal",
            async flag =>
            {
                const error = new Error("Import denied");
                jest.mocked(loadIsolatedTransientStrategyModules).mockRejectedValue(error);
                const warning = jest.spyOn(console, "warn").mockImplementation(() => {});
                let disposed = 0;
                const building = configureRootScope()
                    .map("dependency").asFactory
                    (
                        () => ({ [Symbol.dispose]() { disposed++; } }),
                        DependencyLifetime.Transient
                    )
                    .setAllowRuntimeModuleIsolation(flag)
                    .build();

                expect(building).toBeInstanceOf(Promise);
                const scope = await building;
                scope.resolve("dependency");
                scope[Symbol.dispose]();
                expect(disposed).toBe(1);
                expect(warning).toHaveBeenCalledWith("[scope-di] Module isolation failed; continuing without isolation.", error);
            }
        );

        it
        (
            "returns to synchronous building after explicitly disabling isolation",
            () =>
            {
                const scope = configureRootScope()
                    .setAllowRuntimeModuleIsolation(true)
                    .setAllowRuntimeModuleIsolation(false)
                    .build();

                expect(scope).not.toBeInstanceOf(Promise);
                expect(loadIsolatedTransientStrategyModules).not.toHaveBeenCalled();
            }
        );

        it
        (
            "changing code generation does not disable isolation",
            async () =>
            {
                jest.mocked(loadIsolatedTransientStrategyModules).mockResolvedValue(new Map());
                const building = configureRootScope()
                    .setAllowRuntimeModuleIsolation(true)
                    .setAllowRuntimeCodeGeneration(false)
                    .build();

                expect(building).toBeInstanceOf(Promise);
                await building;
                expect(loadIsolatedTransientStrategyModules).toHaveBeenCalledTimes(1);
            }
        );
    }
);
