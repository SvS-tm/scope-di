// deno-lint-ignore-file no-sloppy-imports
import "reflect-metadata";
import { Container } from "typedi";
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

let containerIndex = 0;

function createIsolatedContainer()
{
    return Container.of(`resolution-benchmark-${containerIndex++}`);
}

export function *resolveValue(_: k_state)
{
    const container = createIsolatedContainer();
    container.set("value", {});

    yield () => do_not_optimize(container.get("value"));
}

export function *resolveSingletonClass(_: k_state)
{
    const container = createIsolatedContainer();
    container.set({ id: "singleton", type: Leaf });
    container.get("singleton");

    yield () => do_not_optimize(container.get("singleton"));
}

export function *resolveTransientClass(_: k_state)
{
    const container = createIsolatedContainer();
    container.set({ id: "transient", type: Leaf, transient: true });

    yield () => do_not_optimize(container.get("transient"));
}

export function *resolveSingletonFactory(_: k_state)
{
    const value = {};
    const container = createIsolatedContainer();
    container.set({ id: "singleton", factory: () => value });
    container.get("singleton");

    yield () => do_not_optimize(container.get("singleton"));
}

export function *resolveTransientFactory(_: k_state)
{
    const container = createIsolatedContainer();
    container.set({ id: "transient", factory: () => ({}), transient: true });

    yield () => do_not_optimize(container.get("transient"));
}

export function *resolveTransientFactoryChain(_: k_state)
{
    const container = createIsolatedContainer();
    container.set({ id: "leaf", factory: () => new Leaf(), transient: true });
    container.set({ id: "middle", factory: () => new Middle(container.get("leaf")), transient: true });
    container.set({ id: "root", factory: () => new Root(container.get("middle")), transient: true });

    yield () => do_not_optimize(container.get("root"));
}

export function *resolveTransientFactoryWithFiveDependencies(_: k_state)
{
    const container = createIsolatedContainer();
    container.set({ id: "a", type: Dependency, transient: true });
    container.set({ id: "b", type: Dependency, transient: true });
    container.set({ id: "c", type: Dependency, transient: true });
    container.set({ id: "d", type: Dependency, transient: true });
    container.set({ id: "e", type: Dependency, transient: true });
    container.set({ id: "parent", factory: () => ({ a: container.get("a"), b: container.get("b"), c: container.get("c"), d: container.get("d"), e: container.get("e") }), transient: true });

    yield () => do_not_optimize(container.get("parent"));
}

export function *resolveTransientFactoryWithSixDependencies(_: k_state)
{
    const container = createIsolatedContainer();
    container.set({ id: "a", type: Dependency, transient: true });
    container.set({ id: "b", type: Dependency, transient: true });
    container.set({ id: "c", type: Dependency, transient: true });
    container.set({ id: "d", type: Dependency, transient: true });
    container.set({ id: "e", type: Dependency, transient: true });
    container.set({ id: "f", type: Dependency, transient: true });
    container.set({ id: "parent", factory: () => ({ a: container.get("a"), b: container.get("b"), c: container.get("c"), d: container.get("d"), e: container.get("e"), f: container.get("f") }), transient: true });

    yield () => do_not_optimize(container.get("parent"));
}
