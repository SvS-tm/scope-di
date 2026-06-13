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
