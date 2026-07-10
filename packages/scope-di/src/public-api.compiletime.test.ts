import { expect } from "tstyche";
import { configureRootScope, DependencyLifetime, type BoxedPromiseDependency } from ".";

// Shared fixtures
class Dependency
{
    public readonly dependency = true;
}

class ParentDependency
{
    public constructor
    (
        public readonly value: string,
        public readonly dependency: Dependency
    )
    {
    }
}

type DependencyAbstraction =
{
    readonly dependency: boolean;
};

// Value mappings and unknown keys
const valueScope = configureRootScope()
    .map("value").asValue("value")
    .build();

const valueRange = valueScope.resolveRange("value");
const valueRangeAsync = valueScope.resolveRangeAsync("value");

expect(valueRange).type.not.toBe<any>();
expect(valueRangeAsync).type.not.toBe<any>();
expect(valueScope.resolveRange("value")).type.toBe<["value"]>();
expect(valueScope.resolve("value")).type.toBe<"value">();
expect(valueScope.resolveRangeAsync("value")).type.toBe<Promise<["value"]>>();
expect(valueScope.resolveAsync("value")).type.toBe<Promise<"value">>();
// @ts-expect-error
valueScope.resolveRange("missing");
// @ts-expect-error
valueScope.resolve("missing");
// @ts-expect-error
valueScope.resolveAsync("missing");

// Sync promise values stay promises for sync/range resolution, but singular async resolution wraps them
const promiseValueScope = configureRootScope()
    .map("storedPromise").asValue(Promise.resolve("stored promise"))
    .build();

expect(promiseValueScope.resolveRange("storedPromise")).type.toBe<[Promise<string>]>();
expect(promiseValueScope.resolve("storedPromise")).type.toBe<Promise<string>>();
expect(promiseValueScope.resolveRangeAsync("storedPromise")).type.toBe<Promise<[Promise<string>]>>();
expect(promiseValueScope.resolveAsync("storedPromise")).type.toBe<Promise<BoxedPromiseDependency<Promise<string>>>>();

async function expectStoredPromiseValue(): Promise<void>
{
    const value = await promiseValueScope.resolveAsync("storedPromise");

    expect(value).type.toBe<BoxedPromiseDependency<Promise<string>>>();
    expect(value.promise).type.toBe<Promise<string>>();
}

void expectStoredPromiseValue;

// Explicit abstraction generics intentionally widen concrete values
const explicitValueScope = configureRootScope()
    .map("value").asValue<string>("value")
    .build();

expect(explicitValueScope.resolveRange("value")).type.toBe<[string]>();

const explicitClassScope = configureRootScope()
    .map("dependency").asClass<DependencyAbstraction>(Dependency, DependencyLifetime.Singleton)
    .build();

expect(explicitClassScope.resolveRange("dependency")).type.toBe<[DependencyAbstraction]>();

const explicitFactoryScope = configureRootScope()
    .map("dependency").asFactory<DependencyAbstraction>(() => new Dependency(), DependencyLifetime.Singleton)
    .build();

expect(explicitFactoryScope.resolveRange("dependency")).type.toBe<[DependencyAbstraction]>();

const explicitDependentScope = configureRootScope()
    .map("value").asValue<string>("value")
    .map("dependency").asClass<DependencyAbstraction>(Dependency, DependencyLifetime.Singleton)
    .map("parent").asDependent("value", "dependency")
    .factory((value, dependency) => ({ value, dependency } as const), DependencyLifetime.Singleton)
    .build();

expect(explicitDependentScope.resolveRange("parent")).type.toBe<[{ readonly value: string; readonly dependency: DependencyAbstraction; }]>();

// Class mappings
const classScope = configureRootScope()
    .map("dependency").asClass(Dependency, DependencyLifetime.Singleton)
    .build();

expect(classScope.resolveRange("dependency")).type.toBe<[Dependency]>();
expect(classScope.resolveRangeAsync("dependency")).type.toBe<Promise<[Dependency]>>();

// Factory mappings
const factoryScope = configureRootScope()
    .map("dependency").asFactory(() => new Dependency(), DependencyLifetime.Singleton)
    .map("literal").asFactory(() => ({ value: "factory" }), DependencyLifetime.Singleton)
    .build();

expect(factoryScope.resolveRange("dependency")).type.toBe<[Dependency]>();
expect(factoryScope.resolveRange("literal")).type.toBe<[{ readonly value: "factory"; }]>();

// Async factory mappings
const asyncFactoryScope = configureRootScope()
    .map("dependency").asFactoryAsync(async () => new Dependency(), DependencyLifetime.Singleton)
    .map("literal").asFactoryAsync(async () => ({ value: "async-factory" }), DependencyLifetime.Singleton)
    .build();

expect(asyncFactoryScope.resolveRange("dependency")).type.toBe<[Promise<Dependency>]>();
expect(asyncFactoryScope.resolveRangeAsync("dependency")).type.toBe<Promise<[Dependency]>>();
expect(asyncFactoryScope.resolveAsync("dependency")).type.toBe<Promise<Dependency>>();
expect(asyncFactoryScope.resolveRange("literal")).type.toBe<[Promise<{ readonly value: "async-factory"; }>]>();
expect(asyncFactoryScope.resolveRangeAsync("literal")).type.toBe<Promise<[{ readonly value: "async-factory"; }]>>();
expect(asyncFactoryScope.resolveAsync("literal")).type.toBe<Promise<{ readonly value: "async-factory"; }>>();

// Async class mappings await dependencies, not constructor return values
const asyncClassScope = configureRootScope()
    .map("dependency").asClassAsync(Dependency, DependencyLifetime.Singleton)
    .build();

expect(asyncClassScope.resolveRange("dependency")).type.toBe<[Promise<Dependency>]>();
expect(asyncClassScope.resolveRangeAsync("dependency")).type.toBe<Promise<[Dependency]>>();
expect(asyncClassScope.resolveAsync("dependency")).type.toBe<Promise<Dependency>>();

// Dependent class mappings
const dependentClassScope = configureRootScope()
    .map("value").asValue("value")
    .map("dependency").asClass(Dependency, DependencyLifetime.Singleton)
    .map("parent").asDependent("value", "dependency")
    .class(ParentDependency, DependencyLifetime.Singleton)
    .build();

expect(dependentClassScope.resolveRange("parent")).type.toBe<[ParentDependency]>();

// Dependent factory mappings
const dependentFactoryScope = configureRootScope()
    .map("value").asValue("value")
    .map("dependency").asClass(Dependency, DependencyLifetime.Singleton)
    .map("parent").asDependent("value", "dependency")
    .factory
    (
        (value, dependency) => 
        {
            expect(value).type.not.toBe<any>();
            expect(dependency).type.not.toBe<any>();
            expect(value).type.toBe<"value">();
            expect(dependency).type.toBe<Dependency>();

            return { value, dependency };
        }, 
        DependencyLifetime.Singleton
    )
    .build();

expect(dependentFactoryScope).type.not.toBe<any>();
expect(dependentFactoryScope.resolve("parent")).type.not.toBe<any>();
expect(dependentFactoryScope.resolveRange("parent")).type.toBe<[{ readonly value: "value"; readonly dependency: Dependency; }]>();

// Dependent async factory mappings await async dependencies
const dependentAsyncFactoryScope = configureRootScope()
    .map("value").asValue("value")
    .map("dependency").asFactoryAsync(async () => new Dependency(), DependencyLifetime.Singleton)
    .map("parent").asDependent("value", "dependency")
    .factoryAsync(async (value, dependency) => ({ value, dependency }), DependencyLifetime.Singleton)
    .build();

expect(dependentAsyncFactoryScope.resolveRange("parent")).type.toBe<[Promise<{ readonly value: "value"; readonly dependency: Dependency; }>]>();
expect(dependentAsyncFactoryScope.resolveRangeAsync("parent")).type.toBe<Promise<[{ readonly value: "value"; readonly dependency: Dependency; }]>>();

// Collection mappings preserve newest-to-oldest tuple order
const collectionScope = configureRootScope()
    .map("items").asValue("first")
    .map("items").asValue(2)
    .build();

expect(collectionScope.resolveRange("items")).type.toBe<[2]>();
expect(collectionScope.resolveRange(["items"])).type.toBe<[[2, "first"]]>();
expect(collectionScope.resolve(["items"])).type.toBe<[2, "first"]>();
expect(collectionScope.resolveRangeAsync(["items"])).type.toBe<Promise<[[2, "first"]]>>();
expect(collectionScope.resolveAsync(["items"])).type.toBe<Promise<[2, "first"]>>();

// Sync promise values inside collections remain raw promises because the collection array is the awaited value
const promiseCollectionScope = configureRootScope()
    .map("items").asValue(Promise.resolve("first"))
    .map("items").asValue(Promise.resolve(2))
    .build();

expect(promiseCollectionScope.resolveRange(["items"])).type.toBe<[[Promise<number>, Promise<string>]]>();
expect(promiseCollectionScope.resolve(["items"])).type.toBe<[Promise<number>, Promise<string>]>();
expect(promiseCollectionScope.resolveRangeAsync(["items"])).type.toBe<Promise<[[Promise<number>, Promise<string>]]>>();
expect(promiseCollectionScope.resolveAsync(["items"])).type.toBe<Promise<[Promise<number>, Promise<string>]>>();

// Dependent collection mappings inject the collection tuple
const collectionDependencyScope = configureRootScope()
    .map("items").asValue("first")
    .map("items").asValue(2)
    .map("parent").asDependent(["items"])
    .factory((items) => items, DependencyLifetime.Singleton)
    .build();

expect(collectionDependencyScope.resolveRange("parent")).type.toBe<[[2, "first"]]>();

// Removed mappings are not resolvable
const removedScope = configureRootScope()
    .map("value").asValue("value")
    .removeMapping("value")
    .build();

// @ts-expect-error
removedScope.resolveRange("value");

// Dependencies must be registered before asDependent can reference them
configureRootScope()
    .map("parent")
    // @ts-expect-error
    .asDependent("missing");

// hasMapping remains available for any allowed key
expect
(
    configureRootScope()
        .map("value").asValue("value")
        .hasMapping("value")
)
    .type.toBeAssignableTo<boolean>();
