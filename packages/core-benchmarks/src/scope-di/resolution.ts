// deno-lint-ignore-file no-sloppy-imports
import { configureRootScope, DependencyLifetime } from "@svs-tm/scope-di";
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

export function *resolveValue(_: k_state)
{
    const scope = configureRootScope()
        .map("value").asValue({})
        .build();

    yield () => do_not_optimize(scope.resolve("value"));
}

export function *resolveSingletonClass(_: k_state)
{
    const scope = configureRootScope()
        .map("singleton").asClass(Leaf, DependencyLifetime.Singleton)
        .build();

    scope.resolve("singleton");

    yield () => do_not_optimize(scope.resolve("singleton"));
}

export function *resolveTransientClass(_: k_state)
{
    const scope = configureRootScope()
        .map("transient").asClass(Leaf, DependencyLifetime.Transient)
        .build();

    yield () => do_not_optimize(scope.resolve("transient"));
}

export function *resolveSingletonFactory(_: k_state)
{
    const value = {};
    const scope = configureRootScope()
        .map("singleton").asFactory(() => value, DependencyLifetime.Singleton)
        .build();

    scope.resolve("singleton");

    yield () => do_not_optimize(scope.resolve("singleton"));
}

export function *resolveTransientFactory(_: k_state)
{
    const scope = configureRootScope()
        .map("transient").asFactory(() => ({}), DependencyLifetime.Transient)
        .build();

    yield () => do_not_optimize(scope.resolve("transient"));
}

export function *resolveTransientFactoryChain(_: k_state)
{
    const scope = configureRootScope()
        .map("leaf").asFactory(() => new Leaf(), DependencyLifetime.Transient)
        .map("middle").asDependent("leaf")
        .factory((leaf) => new Middle(leaf), DependencyLifetime.Transient)
        .map("root").asDependent("middle")
        .factory((middle) => new Root(middle), DependencyLifetime.Transient)
        .build();

    yield () => do_not_optimize(scope.resolve("root"));
}
