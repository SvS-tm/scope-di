import { describe, expect, it, jest } from "@jest/globals";
import { DependencyDescriptorType, DependencyLifetime } from "../../../types";
import type { AsyncClassDependencyDescriptor } from "../../../types/async-class-dependency-descriptor";
import type { AsyncFactoryDependencyDescriptor } from "../../../types/async-factory-dependency-descriptor";
import * as actualStrategies from "../strategies/isolated-transient-strategies";
import { getTestRegistrationMaps } from "./compilation.test-helpers";
import { createSyncValueStrategyScope } from "../strategies/sync/sync-strategy.test-helpers";
import { compileAsyncClassDescriptor } from "./compile-async-class-descriptor";
import { compileAsyncFactoryDescriptor } from "./compile-async-factory-descriptor";

const combinations = [false, true].flatMap(isolation => [false, true].flatMap(codegen => [0, 5, 6].flatMap(count => ["class", "factory"].map(kind => ({ isolation, codegen, count, kind, blocked: false })))));
combinations.push(...["class", "factory"].map(kind => ({ isolation: true, codegen: true, count: 6, kind, blocked: true })));

describe
(
    "Async isolation and code generation selection",
    () =>
    {
        it.each(combinations)
        (
            "$kind: isolation=$isolation, codegen=$codegen, arguments=$count, blocked=$blocked",
            async ({ isolation, codegen, count, kind, blocked }) =>
            {
                const values = Array.from({ length: count }, (_, index) => index);
                const keys = values.map((_value, index) => `dependency${index}`);
                const scope = createSyncValueStrategyScope(new Map(keys.map((key, index) => [key, values[index]])));
                const selectedModule = jest.fn();
                const module: typeof actualStrategies =
                {
                    ...actualStrategies,
                    createAsyncClassStrategy: (...argumentsList) =>
                    {
                        selectedModule();
                        return actualStrategies.createAsyncClassStrategy(...argumentsList);
                    },
                    createAsyncFactoryStrategy: (...argumentsList) =>
                    {
                        selectedModule();
                        return actualStrategies.createAsyncFactoryStrategy(...argumentsList);
                    }
                };
                const generation = jest.spyOn(globalThis, "Function");
                if (blocked)
                    generation.mockImplementation
                    (
                        () =>
                        {
                            throw new EvalError("Blocked");
                        }
                    );

                try
                {
                    const [collections, singles] = getTestRegistrationMaps(scope, keys);
                    if (kind === "class")
                    {
                        class VariadicTarget
                        {
                            public readonly values: unknown[];

                            public constructor(...dependencies: unknown[])
                            {
                                this.values = dependencies;
                            }
                        }
                        const descriptor: AsyncClassDependencyDescriptor<unknown> =
                        {
                            key: "target",
                            type: DependencyDescriptorType.ClassAsync,
                            lifetime: DependencyLifetime.Transient,
                            constructor: VariadicTarget,
                            subDependenciesKeys: keys
                        };
                        compileAsyncClassDescriptor(collections, singles, descriptor, codegen, isolation ? module : undefined);
                        expect(await descriptor.instatiationStrategy(scope)).toEqual({ values });
                    }
                    else
                    {
                        const descriptor: AsyncFactoryDependencyDescriptor<unknown> =
                        {
                            key: "target",
                            type: DependencyDescriptorType.FactoryAsync,
                            lifetime: DependencyLifetime.Transient,
                            factory: async (...dependencies) => ({ values: dependencies }),
                            subDependenciesKeys: keys
                        };
                        compileAsyncFactoryDescriptor(collections, singles, descriptor, codegen, isolation ? module : undefined);
                        expect(await descriptor.instatiationStrategy(scope)).toEqual({ values });
                    }
                    expect(generation).toHaveBeenCalledTimes(codegen && (!isolation || count > 5) ? 1 : 0);
                    expect(selectedModule).toHaveBeenCalledTimes(isolation && (count <= 5 || !codegen || blocked) ? 1 : 0);
                }
                finally
                {
                    generation.mockRestore();
                }
            }
        );
    }
);
