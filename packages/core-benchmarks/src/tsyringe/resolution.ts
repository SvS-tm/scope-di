// deno-lint-ignore-file no-sloppy-imports
import "reflect-metadata";
import { container, type DependencyContainer, instanceCachingFactory, Lifecycle } from "tsyringe";
import { do_not_optimize, type k_state } from "mitata";

class Leaf {}

class Middle
{
    public constructor(public readonly leaf: Leaf)
    {
    }
}

class Root
{
    public constructor(public readonly middle: Middle)
    {
    }
}

class Dependency {}

function createIsolatedContainer(): DependencyContainer
{
    return container.createChildContainer();
}

export function *resolveValue(_: k_state)
{
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("value", { useValue: {} });

    yield () => do_not_optimize(isolatedContainer.resolve("value"));
}

export function *resolveSingletonClass(_: k_state)
{
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("singleton", { useClass: Leaf }, { lifecycle: Lifecycle.Singleton });
    isolatedContainer.resolve("singleton");

    yield () => do_not_optimize(isolatedContainer.resolve("singleton"));
}

export function *resolveTransientClass(_: k_state)
{
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("transient", { useClass: Leaf }, { lifecycle: Lifecycle.Transient });

    yield () => do_not_optimize(isolatedContainer.resolve("transient"));
}

export function *resolveSingletonFactory(_: k_state)
{
    const value = {};
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("singleton", { useFactory: instanceCachingFactory(() => value) });
    isolatedContainer.resolve("singleton");

    yield () => do_not_optimize(isolatedContainer.resolve("singleton"));
}

export function *resolveTransientFactory(_: k_state)
{
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("transient", { useFactory: () => ({}) });

    yield () => do_not_optimize(isolatedContainer.resolve("transient"));
}

export function *resolveTransientFactoryChain(_: k_state)
{
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("leaf", { useFactory: () => new Leaf() });
    isolatedContainer.register("middle", { useFactory: (container: DependencyContainer) => new Middle(container.resolve("leaf")) });
    isolatedContainer.register("root", { useFactory: (container: DependencyContainer) => new Root(container.resolve("middle")) });

    yield () => do_not_optimize(isolatedContainer.resolve("root"));
}

export function *resolveTransientFactoryWithFiveDependencies(_: k_state)
{
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("a", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("b", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("c", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("d", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("e", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("parent", { useFactory: (container: DependencyContainer) => ({ a: container.resolve("a"), b: container.resolve("b"), c: container.resolve("c"), d: container.resolve("d"), e: container.resolve("e") }) });

    yield () => do_not_optimize(isolatedContainer.resolve("parent"));
}

export function *resolveTransientFactoryWithSixDependencies(_: k_state)
{
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("a", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("b", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("c", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("d", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("e", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("f", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("parent", { useFactory: (container: DependencyContainer) => ({ a: container.resolve("a"), b: container.resolve("b"), c: container.resolve("c"), d: container.resolve("d"), e: container.resolve("e"), f: container.resolve("f") }) });

    yield () => do_not_optimize(isolatedContainer.resolve("parent"));
}
