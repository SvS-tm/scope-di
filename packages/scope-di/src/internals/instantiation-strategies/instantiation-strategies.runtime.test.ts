import { describe, expect, it } from "@jest/globals";
import { configureRootScope } from "../../helpers/configure-root-scope";
import { DependencyLifetime } from "../../types/dependency-lifetime";
import { RegisteredDependencies } from "../../types/registered-dependencies";
import { createZeroArgumentsClassStrategy } from "./class/zero-arguments-class-strategy";
import { createOneArgumentsClassStrategy } from "./class/one-arguments-class-strategy";
import { createTwoArgumentsClassStrategy } from "./class/two-arguments-class-strategy";
import { createThreeArgumentsClassStrategy } from "./class/three-arguments-class-strategy";
import { createFourArgumentsClassStrategy } from "./class/four-arguments-class-strategy";
import { createFiveArgumentsClassStrategy } from "./class/five-arguments-class-strategy";
import { createSpreadArgumentsClassStrategy } from "./class/spread-arguments-class-strategy";
import { createRuntimeArgumentsClassStrategy } from "./class/runtime-arguments-class-strategy";
import { createZeroArgumentsFactoryStrategy } from "./factory/zero-arguments-factory-strategy";
import { createOneArgumentsFactoryStrategy } from "./factory/one-arguments-factory-strategy";
import { createTwoArgumentsFactoryStrategy } from "./factory/two-arguments-factory-strategy";
import { createThreeArgumentsFactoryStrategy } from "./factory/three-arguments-factory-strategy";
import { createFourArgumentsFactoryStrategy } from "./factory/four-arguments-factory-strategy";
import { createFiveArgumentsFactoryStrategy } from "./factory/five-arguments-factory-strategy";
import { createSpreadArgumentsFactoryStrategy } from "./factory/spread-arguments-factory-strategy";
import { createRuntimeArgumentsFactoryStrategy } from "./factory/runtime-arguments-factory-strategy";

class CollectedArguments
{
    public constructor(public readonly values: unknown[] = [])
    {
    }
}

class ArgumentList
{
    public readonly values: unknown[];

    public constructor(...values: unknown[])
    {
        this.values = values;
    }
}

function collectArguments(...values: unknown[])
{
    return new CollectedArguments(values);
}

const strategyCases =
[
    { count: 1, createClass: createOneArgumentsClassStrategy, createFactory: createOneArgumentsFactoryStrategy },
    { count: 2, createClass: createTwoArgumentsClassStrategy, createFactory: createTwoArgumentsFactoryStrategy },
    { count: 3, createClass: createThreeArgumentsClassStrategy, createFactory: createThreeArgumentsFactoryStrategy },
    { count: 4, createClass: createFourArgumentsClassStrategy, createFactory: createFourArgumentsFactoryStrategy },
    { count: 5, createClass: createFiveArgumentsClassStrategy, createFactory: createFiveArgumentsFactoryStrategy },
    { count: 8, createClass: createSpreadArgumentsClassStrategy, createFactory: createSpreadArgumentsFactoryStrategy },
    { count: 8, createClass: createRuntimeArgumentsClassStrategy, createFactory: createRuntimeArgumentsFactoryStrategy }
];

describe
(
    "synchronous instantiation strategies",
    () =>
    {
        it
        (
            "zero-argument strategies construct a new result on every invocation",
            () =>
            {
                const scope = configureRootScope().build();
                const instantiateClass = createZeroArgumentsClassStrategy(CollectedArguments);
                const instantiateFactory = createZeroArgumentsFactoryStrategy(collectArguments);

                expect(instantiateClass(scope)).toEqual(new CollectedArguments());
                expect(instantiateClass(scope)).not.toBe(instantiateClass(scope));
                expect(instantiateFactory(scope)).toEqual(new CollectedArguments());
                expect(instantiateFactory(scope)).not.toBe(instantiateFactory(scope));
            }
        );

        it.each(strategyCases)
        (
            "resolves $count arguments through the supplied scope on every construction",
            ({ count, createClass, createFactory }) =>
            {
                const root = configureRootScope()
                    .map("dependency").asFactory(() => ({}), DependencyLifetime.Scoped)
                    .map("transient").asFactory(() => ({}), DependencyLifetime.Transient)
                    .build();
                const firstScope = root.createChildScope();
                const secondScope = root.createChildScope();
                const keys = Array.from({ length: count }, (_, index) => index === 0 ? "dependency" : "transient");
                const instantiateClass = createClass<RegisteredDependencies, typeof ArgumentList>(ArgumentList, keys);
                const instantiateFactory = createFactory<RegisteredDependencies, typeof collectArguments>(collectArguments, keys);

                const firstClass: ArgumentList = instantiateClass(firstScope);
                const nextClass: ArgumentList = instantiateClass(firstScope);
                const secondClass: ArgumentList = instantiateClass(secondScope);
                const firstFactory: CollectedArguments = instantiateFactory(firstScope);
                const nextFactory: CollectedArguments = instantiateFactory(firstScope);
                const secondFactory: CollectedArguments = instantiateFactory(secondScope);

                expect(firstClass.values).toHaveLength(count);
                expect(firstFactory.values).toHaveLength(count);
                expect(firstClass).not.toBe(nextClass);
                expect(firstFactory).not.toBe(nextFactory);
                expect(firstClass.values[0]).toBe(firstScope.resolve("dependency"));
                expect(firstFactory.values[0]).toBe(firstClass.values[0]);
                expect(nextClass.values[0]).toBe(firstClass.values[0]);
                expect(nextFactory.values[0]).toBe(firstFactory.values[0]);
                expect(secondClass.values[0]).toBe(secondScope.resolve("dependency"));
                expect(secondFactory.values[0]).toBe(secondClass.values[0]);
                expect(secondClass.values[0]).not.toBe(firstClass.values[0]);

                for (let index = 1; index < count; ++index)
                {
                    expect(nextClass.values[index]).not.toBe(firstClass.values[index]);
                    expect(nextFactory.values[index]).not.toBe(firstFactory.values[index]);
                }
            }
        );

        it.each
        (
            [
                { name: "explicit", createClass: createThreeArgumentsClassStrategy, createFactory: createThreeArgumentsFactoryStrategy },
                { name: "spread", createClass: createSpreadArgumentsClassStrategy, createFactory: createSpreadArgumentsFactoryStrategy },
                { name: "runtime", createClass: createRuntimeArgumentsClassStrategy, createFactory: createRuntimeArgumentsFactoryStrategy }
            ]
        )
        (
            "$name strategies preserve argument order, collections, and promise values",
            ({ createClass, createFactory }) =>
            {
                const promise = Promise.resolve(42);
                const scope = configureRootScope()
                    .map("collection").asValue("first")
                    .map("collection").asValue("second")
                    .map("promise").asValue(promise)
                    .map("value").asValue(7)
                    .build();
                const keys: ("value" | "promise" | ["collection"])[] = ["value", ["collection"], "promise"];
                const instantiateClass = createClass<RegisteredDependencies, typeof ArgumentList>(ArgumentList, keys);
                const instantiateFactory = createFactory<RegisteredDependencies, typeof collectArguments>(collectArguments, keys);

                const collection = scope.resolve(["collection"]);

                expect(instantiateClass(scope).values).toEqual([7, collection, promise]);
                expect(instantiateFactory(scope).values).toEqual([7, collection, promise]);
                expect(instantiateFactory(scope).values[2]).toBe(promise);
            }
        );

        it
        (
            "runtime strategies support no dependencies and keep arbitrary keys out of generated source",
            () =>
            {
                const key = "quote'\"; special-key";
                const scope = configureRootScope().map(key).asValue(42).build();
                const instantiateClass = createRuntimeArgumentsClassStrategy(ArgumentList, [key]);
                const instantiateFactory = createRuntimeArgumentsFactoryStrategy(collectArguments, [key]);

                expect(instantiateClass(scope).values).toEqual([42]);
                expect(instantiateFactory(scope).values).toEqual([42]);
                expect(createRuntimeArgumentsClassStrategy(ArgumentList, [])(scope).values).toEqual([]);
                expect(createRuntimeArgumentsFactoryStrategy(collectArguments, [])(scope).values).toEqual([]);
            }
        );

        it
        (
            "runtime strategies propagate factory errors",
            () =>
            {
                const error = new Error("Factory failed");
                const factory = () =>
                {
                    throw error;
                };
                const instantiateFactory = createRuntimeArgumentsFactoryStrategy(factory, []);
                const scope = configureRootScope().build();

                expect(() => instantiateFactory(scope)).toThrow(error);
            }
        );
    }
);

