import { expectAssignable, expectError, expectNotType, expectType } from "tsd";
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

expectNotType<any>(valueRange);
expectNotType<any>(valueRangeAsync);
expectType<["value"]>(valueScope.resolveRange("value"));
expectType<"value">(valueScope.resolve("value"));
expectType<Promise<["value"]>>(valueScope.resolveRangeAsync("value"));
expectType<Promise<"value">>(valueScope.resolveAsync("value"));
expectError(valueScope.resolveRange("missing"));
expectError(valueScope.resolve("missing"));
expectError(valueScope.resolveAsync("missing"));

// Sync promise values stay promises for sync/range resolution, but singular async resolution wraps them
const promiseValueScope = configureRootScope()
    .map("storedPromise").asValue(Promise.resolve("stored promise"))
    .build();

expectType<[Promise<string>]>(promiseValueScope.resolveRange("storedPromise"));
expectType<Promise<string>>(promiseValueScope.resolve("storedPromise"));
expectType<Promise<[Promise<string>]>>(promiseValueScope.resolveRangeAsync("storedPromise"));
expectType<Promise<BoxedPromiseDependency<Promise<string>>>>(promiseValueScope.resolveAsync("storedPromise"));

async function expectStoredPromiseValue(): Promise<void>
{
    const value = await promiseValueScope.resolveAsync("storedPromise");

    expectType<BoxedPromiseDependency<Promise<string>>>(value);
    expectType<Promise<string>>(value.promise);
}

void expectStoredPromiseValue;

// Explicit abstraction generics intentionally widen concrete values
const explicitValueScope = configureRootScope()
    .map("value").asValue<string>("value")
    .build();

expectType<[string]>(explicitValueScope.resolveRange("value"));

const explicitClassScope = configureRootScope()
    .map("dependency").asClass<DependencyAbstraction>(Dependency, DependencyLifetime.Singleton)
    .build();

expectType<[DependencyAbstraction]>(explicitClassScope.resolveRange("dependency"));

const explicitFactoryScope = configureRootScope()
    .map("dependency").asFactory<DependencyAbstraction>(() => new Dependency(), DependencyLifetime.Singleton)
    .build();

expectType<[DependencyAbstraction]>(explicitFactoryScope.resolveRange("dependency"));

const explicitDependentScope = configureRootScope()
    .map("value").asValue<string>("value")
    .map("dependency").asClass<DependencyAbstraction>(Dependency, DependencyLifetime.Singleton)
    .map("parent").asDependent("value", "dependency")
    .factory((value, dependency) => ({ value, dependency } as const), DependencyLifetime.Singleton)
    .build();

expectType<[{ readonly value: string; readonly dependency: DependencyAbstraction; }]>(explicitDependentScope.resolveRange("parent"));

// Class mappings
const classScope = configureRootScope()
    .map("dependency").asClass(Dependency, DependencyLifetime.Singleton)
    .build();

expectType<[Dependency]>(classScope.resolveRange("dependency"));
expectType<Promise<[Dependency]>>(classScope.resolveRangeAsync("dependency"));

// Factory mappings
const factoryScope = configureRootScope()
    .map("dependency").asFactory(() => new Dependency(), DependencyLifetime.Singleton)
    .map("literal").asFactory(() => ({ value: "factory" }), DependencyLifetime.Singleton)
    .build();

expectType<[Dependency]>(factoryScope.resolveRange("dependency"));
expectType<[{ readonly value: "factory"; }]>(factoryScope.resolveRange("literal"));

// Async factory mappings
const asyncFactoryScope = configureRootScope()
    .map("dependency").asFactoryAsync(async () => new Dependency(), DependencyLifetime.Singleton)
    .map("literal").asFactoryAsync(async () => ({ value: "async-factory" }), DependencyLifetime.Singleton)
    .build();

expectType<[Promise<Dependency>]>(asyncFactoryScope.resolveRange("dependency"));
expectType<Promise<[Dependency]>>(asyncFactoryScope.resolveRangeAsync("dependency"));
expectType<Promise<Dependency>>(asyncFactoryScope.resolveAsync("dependency"));
expectType<[Promise<{ readonly value: "async-factory"; }>]>(asyncFactoryScope.resolveRange("literal"));
expectType<Promise<[{ readonly value: "async-factory"; }]>>(asyncFactoryScope.resolveRangeAsync("literal"));
expectType<Promise<{ readonly value: "async-factory"; }>>(asyncFactoryScope.resolveAsync("literal"));

// Async class mappings await dependencies, not constructor return values
const asyncClassScope = configureRootScope()
    .map("dependency").asClassAsync(Dependency, DependencyLifetime.Singleton)
    .build();

expectType<[Promise<Dependency>]>(asyncClassScope.resolveRange("dependency"));
expectType<Promise<[Dependency]>>(asyncClassScope.resolveRangeAsync("dependency"));
expectType<Promise<Dependency>>(asyncClassScope.resolveAsync("dependency"));

// Dependent class mappings
const dependentClassScope = configureRootScope()
    .map("value").asValue("value")
    .map("dependency").asClass(Dependency, DependencyLifetime.Singleton)
    .map("parent").asDependent("value", "dependency")
    .class(ParentDependency, DependencyLifetime.Singleton)
    .build();

expectType<[ParentDependency]>(dependentClassScope.resolveRange("parent"));

// Dependent factory mappings
const dependentFactoryScope = configureRootScope()
    .map("value").asValue("value")
    .map("dependency").asClass(Dependency, DependencyLifetime.Singleton)
    .map("parent").asDependent("value", "dependency")
    .factory
    (
        (value, dependency) => 
        {
            expectNotType<any>(value);
            expectNotType<any>(dependency);
            expectType<"value">(value);
            expectType<Dependency>(dependency);

            return { value, dependency };
        }, 
        DependencyLifetime.Singleton
    )
    .build();

expectNotType<any>(dependentFactoryScope);
expectNotType<any>(dependentFactoryScope.resolve("parent"));
expectType<[{ readonly value: "value"; readonly dependency: Dependency; }]>(dependentFactoryScope.resolveRange("parent"));

// Dependent async factory mappings await async dependencies
const dependentAsyncFactoryScope = configureRootScope()
    .map("value").asValue("value")
    .map("dependency").asFactoryAsync(async () => new Dependency(), DependencyLifetime.Singleton)
    .map("parent").asDependent("value", "dependency")
    .factoryAsync(async (value, dependency) => ({ value, dependency }), DependencyLifetime.Singleton)
    .build();

expectType<[Promise<{ readonly value: "value"; readonly dependency: Dependency; }>]>(dependentAsyncFactoryScope.resolveRange("parent"));
expectType<Promise<[{ readonly value: "value"; readonly dependency: Dependency; }]>>(dependentAsyncFactoryScope.resolveRangeAsync("parent"));

// Collection mappings preserve newest-to-oldest tuple order
const collectionScope = configureRootScope()
    .map("items").asValue("first")
    .map("items").asValue(2)
    .build();

expectType<[2]>(collectionScope.resolveRange("items"));
expectType<[[2, "first"]]>(collectionScope.resolveRange(["items"]));
expectType<[2, "first"]>(collectionScope.resolve(["items"]));
expectType<Promise<[[2, "first"]]>>(collectionScope.resolveRangeAsync(["items"]));
expectType<Promise<[2, "first"]>>(collectionScope.resolveAsync(["items"]));

// Sync promise values inside collections remain raw promises because the collection array is the awaited value
const promiseCollectionScope = configureRootScope()
    .map("items").asValue(Promise.resolve("first"))
    .map("items").asValue(Promise.resolve(2))
    .build();

expectType<[[Promise<number>, Promise<string>]]>(promiseCollectionScope.resolveRange(["items"]));
expectType<[Promise<number>, Promise<string>]>(promiseCollectionScope.resolve(["items"]));
expectType<Promise<[[Promise<number>, Promise<string>]]>>(promiseCollectionScope.resolveRangeAsync(["items"]));
expectType<Promise<[Promise<number>, Promise<string>]>>(promiseCollectionScope.resolveAsync(["items"]));

// Dependent collection mappings inject the collection tuple
const collectionDependencyScope = configureRootScope()
    .map("items").asValue("first")
    .map("items").asValue(2)
    .map("parent").asDependent(["items"])
    .factory((items) => items, DependencyLifetime.Singleton)
    .build();

expectType<[[2, "first"]]>(collectionDependencyScope.resolveRange("parent"));

// Removed mappings are not resolvable
const removedScope = configureRootScope()
    .map("value").asValue("value")
    .removeMapping("value")
    .build();

expectError(removedScope.resolveRange("value"));

// Dependencies must be registered before asDependent can reference them
expectError
(
    configureRootScope()
        .map("parent")
        .asDependent("missing")
);

// hasMapping remains available for any allowed key
expectAssignable<boolean>
(
    configureRootScope()
        .map("value").asValue("value")
        .hasMapping("value")
);
