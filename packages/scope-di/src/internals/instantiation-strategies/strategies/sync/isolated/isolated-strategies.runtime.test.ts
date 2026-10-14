import { describe, expect, it, jest } from "@jest/globals";
import { DependencyDescriptorType, DependencyLifetime } from "../../../../../types";
import { createSyncValueStrategyScope } from "../sync-strategy.test-helpers";
import { createClassStrategy } from "./class/create-class-strategy";
import { createFactoryStrategy } from "./factory/create-factory-strategy";

const cases = [0, 1, 2, 3, 4, 5, 6, 10].flatMap
(
    count => ["none", "sync", "async", "both"].map(disposal => ({ count, disposal }))
);

describe
(
    "Isolated sync strategies",
    () =>
    {
        it.each(cases)
        (
            "preserves argument order, freshness and $disposal disposal for $count arguments",
            async ({ count, disposal }) =>
            {
                const values = Array.from({ length: count }, (_, index) => ({ index }));
                const resolvers = values.map(value => () => value);
                const scope = createSyncValueStrategyScope(new Map());
                const trackSync = jest.spyOn(scope, "addDisposableDependency");
                const trackAsync = jest.spyOn(scope, "addAsyncDisposableDependency");
                const dispose = jest.fn();
                const asyncDispose = jest.fn(async () => {});

                class Target
                {
                    public readonly values: unknown[];

                    public constructor(...dependencies: unknown[])
                    {
                        this.values = dependencies;

                        if (disposal === "sync" || disposal === "both")
                            Object.assign(this, { [Symbol.dispose]: dispose });
                        if (disposal === "async" || disposal === "both")
                            Object.assign(this, { [Symbol.asyncDispose]: asyncDispose });
                    }
                }

                const classStrategy = createClassStrategy
                (
                    { key: "class", type: DependencyDescriptorType.Class, lifetime: DependencyLifetime.Transient, constructor: Target },
                    resolvers
                );
                const factoryStrategy = createFactoryStrategy
                (
                    { key: "factory", type: DependencyDescriptorType.Factory, lifetime: DependencyLifetime.Transient, factory: (...dependencies) => new Target(...dependencies) },
                    resolvers
                );

                for (const strategy of [classStrategy, factoryStrategy])
                {
                    const first = strategy(scope);
                    const second = strategy(scope);

                    expect(first).not.toBe(second);
                    expect(first.values).toEqual(values);
                    expect(second.values).toEqual(values);
                    values.forEach((value, index) => expect(first.values[index]).toBe(value));

                    if (disposal === "async" || disposal === "both")
                    {
                        expect(trackAsync.mock.calls.flat()).toContain(first);
                        expect(trackAsync.mock.calls.flat()).toContain(second);
                    }
                    else if (disposal === "sync")
                    {
                        expect(trackSync.mock.calls.flat()).toContain(first);
                        expect(trackSync.mock.calls.flat()).toContain(second);
                    }
                }

                expect(trackSync).toHaveBeenCalledTimes(disposal === "sync" ? 4 : 0);
                expect(trackAsync).toHaveBeenCalledTimes(disposal === "async" || disposal === "both" ? 4 : 0);

                await scope[Symbol.asyncDispose]();
                expect(dispose).toHaveBeenCalledTimes(disposal === "sync" ? 4 : 0);
                expect(asyncDispose).toHaveBeenCalledTimes(disposal === "async" || disposal === "both" ? 4 : 0);
            }
        );
    }
);
