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

                expect(scope.resolve()).toStrictEqual([]);
                await expect(scope.resolveAsync()).resolves.toStrictEqual([]);
                expect(() => scope.resolve("missing" as never)).toThrow(DependencyNotRegisteredError);
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

                const [resolved] = scope.resolve(key);
                const [resolvedAgain] = childScope.resolve(key);

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

                const [singleton] = scope.resolve("singleton");
                const [singletonFromChild] = childScope.resolve("singleton");
                const [scoped] = scope.resolve("scoped");
                const [scopedAgain] = scope.resolve("scoped");
                const [scopedFromChild] = childScope.resolve("scoped");
                const [transient] = scope.resolve("transient");
                const [transientAgain] = scope.resolve("transient");

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

                const [singleton] = scope.resolve("singleton");
                const [singletonAgain] = scope.resolve("singleton");
                const [transient] = scope.resolve("transient");
                const [transientAgain] = scope.resolve("transient");

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

                const [promise] = scope.resolve(key);

                expect(promise).toBeInstanceOf(Promise);
                await expect(promise).resolves.toBe(value);

                const [resolved] = await scope.resolveAsync(key);

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

                const [promise] = scope.resolve(key);
                const [samePromise] = scope.resolve(key);

                expect(samePromise).toBe(promise);
                expect(factory).toHaveBeenCalledTimes(1);

                resolvePending(value);

                await expect(promise).resolves.toBe(value);

                const retryScope = configureRootScope()
                    .map(key).asFactoryAsync(factory, DependencyLifetime.Singleton)
                    .build();

                await expect(retryScope.resolveAsync(key)).rejects.toBe(error);

                const [resolved] = await retryScope.resolveAsync(key);

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

                const [parent] = scope.resolve("parent");

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

                const [items] = scope.resolve("parent");

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

                const [dependency] = scope.resolve("parent");

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

                const [parent] = await scope.resolveAsync("parent");

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

                const [parent] = await scope.resolveAsync("parent");

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

                const [defaultDependency] = scope.resolve("key");
                const [collection] = scope.resolve(["key"] as never);

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

                expect(() => scope.resolve(key as never)).toThrow(DependencyNotRegisteredError);
                expect(() => scope.resolve([key] as never)).toThrow(DependencyNotRegisteredError);
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

                const [a, b, c] = scope.resolve("a", "b", "c");

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

                expect(scope.resolve("a")).toStrictEqual(["a"]);
                expect(() => scope.resolve("b" as never)).toThrow(DependencyNotRegisteredError);

                const updatedScope = updatedBuilder.build();

                expect(updatedScope.resolve("b")).toStrictEqual(["b"]);
            }
        );
    }
);
