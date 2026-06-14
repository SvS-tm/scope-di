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

class Dependency {}

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

function createDependency()
{
    return new Dependency();
}

function createParentWithFiveDependencies(a: Dependency, b: Dependency, c: Dependency, d: Dependency, e: Dependency)
{
    return { a, b, c, d, e };
}
createParentWithFiveDependencies.inject = ["a", "b", "c", "d", "e"] as const;

function createParentWithSixDependencies(a: Dependency, b: Dependency, c: Dependency, d: Dependency, e: Dependency, f: Dependency)
{
    return { a, b, c, d, e, f };
}
createParentWithSixDependencies.inject = ["a", "b", "c", "d", "e", "f"] as const;

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

export function *resolveTransientFactoryWithFiveDependencies(_: k_state)
{
    const injector = createInjector()
        .provideFactory("a", createDependency, Scope.Transient)
        .provideFactory("b", createDependency, Scope.Transient)
        .provideFactory("c", createDependency, Scope.Transient)
        .provideFactory("d", createDependency, Scope.Transient)
        .provideFactory("e", createDependency, Scope.Transient)
        .provideFactory("parent", createParentWithFiveDependencies, Scope.Transient);

    yield () => do_not_optimize(injector.resolve("parent"));
}

export function *resolveTransientFactoryWithSixDependencies(_: k_state)
{
    const injector = createInjector()
        .provideFactory("a", createDependency, Scope.Transient)
        .provideFactory("b", createDependency, Scope.Transient)
        .provideFactory("c", createDependency, Scope.Transient)
        .provideFactory("d", createDependency, Scope.Transient)
        .provideFactory("e", createDependency, Scope.Transient)
        .provideFactory("f", createDependency, Scope.Transient)
        .provideFactory("parent", createParentWithSixDependencies, Scope.Transient);

    yield () => do_not_optimize(injector.resolve("parent"));
}
