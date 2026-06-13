// deno-lint-ignore-file no-sloppy-imports
import { createInjector, Scope } from "typed-inject";
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

function createLeaf()
{
    return new Leaf();
}

function createMiddle(leaf: Leaf)
{
    return new Middle(leaf);
}
createMiddle.inject = ["leaf"] as const;

function createRoot(middle: Middle)
{
    return new Root(middle);
}
createRoot.inject = ["middle"] as const;

export function *resolveValue(_: k_state)
{
    const injector = createInjector()
        .provideValue("value", {});

    yield () => do_not_optimize(injector.resolve("value"));
}

export function *resolveSingletonClass(_: k_state)
{
    const injector = createInjector()
        .provideClass("singleton", Leaf, Scope.Singleton);
    injector.resolve("singleton");

    yield () => do_not_optimize(injector.resolve("singleton"));
}

export function *resolveTransientClass(_: k_state)
{
    const injector = createInjector()
        .provideClass("transient", Leaf, Scope.Transient);

    yield () => do_not_optimize(injector.resolve("transient"));
}

export function *resolveSingletonFactory(_: k_state)
{
    const value = {};
    const injector = createInjector()
        .provideFactory("singleton", () => value, Scope.Singleton);
    injector.resolve("singleton");

    yield () => do_not_optimize(injector.resolve("singleton"));
}

export function *resolveTransientFactory(_: k_state)
{
    const injector = createInjector()
        .provideFactory("transient", () => ({}), Scope.Transient);

    yield () => do_not_optimize(injector.resolve("transient"));
}

export function *resolveTransientFactoryChain(_: k_state)
{
    const injector = createInjector()
        .provideFactory("leaf", createLeaf, Scope.Transient)
        .provideFactory("middle", createMiddle, Scope.Transient)
        .provideFactory("root", createRoot, Scope.Transient);

    yield () => do_not_optimize(injector.resolve("root"));
}
