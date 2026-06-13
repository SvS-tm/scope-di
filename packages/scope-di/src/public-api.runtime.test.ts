import { describe, expect, it, jest } from "@jest/globals";
import { configureRootScope, DependencyLifetime, DependencyNotRegisteredError } from ".";

describe
(
    "public API: runtime",
    () =>
    {
        it
        (
            "configureRootScope builds a usable empty scope",
            async () =>
            {
                const scope = configureRootScope().build();

                expect(scope.resolveRange()).toStrictEqual([]);
                await expect(scope.resolveRangeAsync()).resolves.toStrictEqual([]);
                expect(() => scope.resolveRange("missing" as never)).toThrow(DependencyNotRegisteredError);
            }
        );

        it
        (
            "resolve returns a single dependency without tuple wrapping",
            () =>
            {
                const scope = configureRootScope()
                    .map("value").asValue("value")
                    .map("items").asValue("old")
                    .map("items").asValue("new")
                    .build();

                expect(scope.resolve("value")).toBe("value");
                expect(scope.resolve(["items"])).toStrictEqual(["new", "old"]);
            }
        );

        it
        (
            "resolveAsync returns a single awaited dependency without tuple wrapping",
            async () =>
            {
                const asyncValue = {};
                const scope = configureRootScope()
                    .map("value").asValue("value")
                    .map("async").asFactoryAsync(async () => asyncValue, DependencyLifetime.Singleton)
                    .map("items").asValue("old")
                    .map("items").asFactoryAsync(async () => "new", DependencyLifetime.Singleton)
                    .map("sync-items").asValue("sync-old")
                    .map("sync-items").asValue("sync-new")
                    .build();

                await expect(scope.resolveAsync("value")).resolves.toBe("value");
                await expect(scope.resolveAsync("async")).resolves.toBe(asyncValue);
                await expect(scope.resolveAsync(["items"])).resolves.toStrictEqual(["new", "old"]);
                await expect(scope.resolveAsync(["sync-items"])).resolves.toStrictEqual(["sync-new", "sync-old"]);
            }
        );

        it
        (
            "map().asValue() registers a singleton value and marks the mapping as present",
            () =>
            {
                const key = "value";
                const value = {};
                const builder = configureRootScope().map(key).asValue(value);

                expect(builder.hasMapping(key)).toBe(true);

                const scope = builder.build();
                const childScope = scope.createChildScope();

                const [resolved] = scope.resolveRange(key);
                const [resolvedAgain] = childScope.resolveRange(key);

                expect(resolved).toBe(value);
                expect(resolvedAgain).toBe(value);
            }
        );

        it
        (
            "map().asClass() respects singleton, scoped, and transient lifetimes",
            () =>
            {
                class SingletonDependency {}
                class ScopedDependency {}
                class TransientDependency {}

                const scope = configureRootScope()
                    .map("singleton").asClass(SingletonDependency, DependencyLifetime.Singleton)
                    .map("scoped").asClass(ScopedDependency, DependencyLifetime.Scoped)
                    .map("transient").asClass(TransientDependency, DependencyLifetime.Transient)
                    .build();

                const childScope = scope.createChildScope();

                const [singleton] = scope.resolveRange("singleton");
                const [singletonFromChild] = childScope.resolveRange("singleton");
                const [scoped] = scope.resolveRange("scoped");
                const [scopedAgain] = scope.resolveRange("scoped");
                const [scopedFromChild] = childScope.resolveRange("scoped");
                const [transient] = scope.resolveRange("transient");
                const [transientAgain] = scope.resolveRange("transient");

                expect(singletonFromChild).toBe(singleton);
                expect(scopedAgain).toBe(scoped);
                expect(scopedFromChild).not.toBe(scoped);
                expect(transientAgain).not.toBe(transient);
            }
        );

        it
        (
            "map().asFactory() invokes singleton factories once and transient factories per resolve",
            () =>
            {
                const singletonValue = {};
                const singletonFactory = jest.fn(() => singletonValue);
                const transientFactory = jest.fn(() => ({}));

                const scope = configureRootScope()
                    .map("singleton").asFactory(singletonFactory, DependencyLifetime.Singleton)
                    .map("transient").asFactory(transientFactory, DependencyLifetime.Transient)
                    .build();

                const [singleton] = scope.resolveRange("singleton");
                const [singletonAgain] = scope.resolveRange("singleton");
                const [transient] = scope.resolveRange("transient");
                const [transientAgain] = scope.resolveRange("transient");

                expect(singletonAgain).toBe(singleton);
                expect(singletonFactory).toHaveBeenCalledTimes(1);
                expect(transientAgain).not.toBe(transient);
                expect(transientFactory).toHaveBeenCalledTimes(2);
            }
        );

        it
        (
            "map().asClassAsync() treats a constructor returned promise as the dependency value",
            async () =>
            {
                const key = "async-class";
                const value = {};
                const AsyncDependency = class
                {
                    public constructor()
                    {
                        return Promise.resolve(value) as unknown as object;
                    }
                } as unknown as new () => Promise<object>;

                const scope = configureRootScope()
                    .map(key).asClassAsync(AsyncDependency, DependencyLifetime.Singleton)
                    .build();

                const [promise] = scope.resolveRange(key);

                expect(promise).toBeInstanceOf(Promise);
                await expect(promise).resolves.toBe(value);

                const [resolved] = await scope.resolveRangeAsync(key);

                expect(resolved).toBeInstanceOf(Promise);
                await expect(resolved).resolves.toBe(value);
            }
        );

        it
        (
            "map().asFactoryAsync() shares pending singleton promises and retries after rejection",
            async () =>
            {
                const key = "async-factory";
                const error = new Error("Failed");
                const value = {};
                let resolvePending!: (value: object) => void;
                const pending = new Promise<object>((resolve) => void (resolvePending = resolve));
                const factory = jest.fn<() => Promise<object>>()
                    .mockReturnValueOnce(pending)
                    .mockRejectedValueOnce(error)
                    .mockResolvedValue(value);

                const scope = configureRootScope()
                    .map(key).asFactoryAsync(factory, DependencyLifetime.Singleton)
                    .build();

                const [promise] = scope.resolveRange(key);
                const [samePromise] = scope.resolveRange(key);

                expect(samePromise).toBe(promise);
                expect(factory).toHaveBeenCalledTimes(1);

                resolvePending(value);

                await expect(promise).resolves.toBe(value);

                const retryScope = configureRootScope()
                    .map(key).asFactoryAsync(factory, DependencyLifetime.Singleton)
                    .build();

                await expect(retryScope.resolveRangeAsync(key)).rejects.toBe(error);

                const [resolved] = await retryScope.resolveRangeAsync(key);

                expect(resolved).toBe(value);
                expect(factory).toHaveBeenCalledTimes(3);
            }
        );

        it
        (
            "asDependent().class() injects dependencies in key order",
            () =>
            {
                class Parent
                {
                    public constructor
                    (
                        public readonly first: string,
                        public readonly second: number
                    )
                    {
                    }
                }

                const scope = configureRootScope()
                    .map("first").asValue("first")
                    .map("second").asValue(2)
                    .map("parent").asDependent("first", "second")
                    .class(Parent, DependencyLifetime.Singleton)
                    .build();

                const [parent] = scope.resolveRange("parent");

                expect(parent).toBeInstanceOf(Parent);
                expect(parent.first).toBe("first");
                expect(parent.second).toBe(2);
            }
        );

        it
        (
            "asDependent().factory() injects collection dependencies in collection order",
            () =>
            {
                const scope = configureRootScope()
                    .map("item").asValue("old")
                    .map("item").asValue("new")
                    .map("parent").asDependent(["item"] as never)
                    .factory((items: string[]) => items, DependencyLifetime.Singleton)
                    .build();

                const [items] = scope.resolveRange("parent");

                expect(items).toStrictEqual(["new", "old"]);
            }
        );

        it
        (
            "sync dependent factories receive async dependencies as promises",
            async () =>
            {
                const value = {};

                const scope = configureRootScope()
                    .map("async").asFactoryAsync(async () => value, DependencyLifetime.Singleton)
                    .map("parent").asDependent("async")
                    .factory((dependency) => dependency, DependencyLifetime.Singleton)
                    .build();

                const [dependency] = scope.resolveRange("parent");

                expect(dependency).toBeInstanceOf(Promise);
                await expect(dependency).resolves.toBe(value);
            }
        );

        it
        (
            "asDependent().classAsync() receives awaited sync, async, and collection dependencies",
            async () =>
            {
                const asyncValue = {};

                class Parent
                {
                    public constructor
                    (
                        public readonly syncValue: string,
                        public readonly resolvedAsyncValue: object,
                        public readonly items: string[]
                    )
                    {
                    }
                }

                const scope = configureRootScope()
                    .map("sync").asValue("sync")
                    .map("async").asFactoryAsync(async () => asyncValue, DependencyLifetime.Singleton)
                    .map("item").asValue("old")
                    .map("item").asValue("new")
                    .map("parent").asDependent("sync", "async", ["item"] as never)
                    .classAsync(Parent, DependencyLifetime.Singleton)
                    .build();

                const [parent] = await scope.resolveRangeAsync("parent");

                expect(parent).toBeInstanceOf(Parent);
                expect(parent.syncValue).toBe("sync");
                expect(parent.resolvedAsyncValue).toBe(asyncValue);
                expect(parent.items).toStrictEqual(["new", "old"]);
            }
        );

        it
        (
            "asDependent().factoryAsync() receives awaited dependencies",
            async () =>
            {
                const asyncValue = {};
                const factory = jest.fn
                (
                    async (syncValue: string, resolvedAsyncValue: object) => 
                    ({
                        syncValue,
                        resolvedAsyncValue
                    })
                );

                const scope = configureRootScope()
                    .map("sync").asValue("sync")
                    .map("async").asFactoryAsync(async () => asyncValue, DependencyLifetime.Singleton)
                    .map("parent").asDependent("sync", "async")
                    .factoryAsync(factory, DependencyLifetime.Singleton)
                    .build();

                const [parent] = await scope.resolveRangeAsync("parent");

                expect(parent).toStrictEqual
                (
                    {
                        syncValue: "sync",
                        resolvedAsyncValue: asyncValue
                    }
                );
                expect(factory).toHaveBeenCalledWith("sync", asyncValue);
            }
        );

        it
        (
            "multiple registrations under the same key resolve newest by default and newest-to-oldest as a collection",
            () =>
            {
                const scope = configureRootScope()
                    .map("key").asValue("old")
                    .map("key").asValue("middle")
                    .map("key").asValue("new")
                    .build();

                const [defaultDependency] = scope.resolveRange("key");
                const [collection] = scope.resolveRange(["key"] as never);

                expect(defaultDependency).toBe("new");
                expect(collection).toStrictEqual(["new", "middle", "old"]);
            }
        );

        it
        (
            "removeMapping() removes all registrations for a key",
            () =>
            {
                const key = "key";
                const builder = configureRootScope()
                    .map(key).asValue("old")
                    .map(key).asValue("new");

                expect(builder.hasMapping(key)).toBe(true);

                const updatedBuilder = builder.removeMapping(key);

                expect(updatedBuilder.hasMapping(key)).toBe(false);

                const scope = updatedBuilder.build();

                expect(() => scope.resolveRange(key as never)).toThrow(DependencyNotRegisteredError);
                expect(() => scope.resolveRange([key] as never)).toThrow(DependencyNotRegisteredError);
            }
        );

        it
        (
            "builder chaining can register multiple mappings before build",
            () =>
            {
                const scope = configureRootScope()
                    .map("a").asValue("a")
                    .map("b").asFactory(() => "b", DependencyLifetime.Singleton)
                    .map("c").asClass(class C {}, DependencyLifetime.Singleton)
                    .build();

                const [a, b, c] = scope.resolveRange("a", "b", "c");

                expect(a).toBe("a");
                expect(b).toBe("b");
                expect(c).toBeInstanceOf(Object);
            }
        );

        it
        (
            "build() snapshots current mappings and does not expose later builder mutations to existing scopes",
            () =>
            {
                const builder = configureRootScope()
                    .map("a").asValue("a");

                const scope = builder.build();

                const updatedBuilder = builder.map("b").asValue("b");

                expect(scope.resolveRange("a")).toStrictEqual(["a"]);
                expect(() => scope.resolveRange("b" as never)).toThrow(DependencyNotRegisteredError);

                const updatedScope = updatedBuilder.build();

                expect(updatedScope.resolveRange("b")).toStrictEqual(["b"]);
            }
        );
    }
);
