// deno-lint-ignore-file no-sloppy-imports
import { asClass, asFunction, asValue, createContainer, Lifetime } from "awilix";
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
    const container = createContainer();
    container.register("value", asValue({}));

    yield () => do_not_optimize(container.resolve("value"));
}

export function *resolveSingletonClass(_: k_state)
{
    const container = createContainer();
    container.register("singleton", asClass(Leaf, { lifetime: Lifetime.SINGLETON }));
    container.resolve("singleton");

    yield () => do_not_optimize(container.resolve("singleton"));
}

export function *resolveTransientClass(_: k_state)
{
    const container = createContainer();
    container.register("transient", asClass(Leaf, { lifetime: Lifetime.TRANSIENT }));

    yield () => do_not_optimize(container.resolve("transient"));
}

export function *resolveSingletonFactory(_: k_state)
{
    const value = {};
    const container = createContainer();
    container.register("singleton", asFunction(() => value, { lifetime: Lifetime.SINGLETON }));
    container.resolve("singleton");

    yield () => do_not_optimize(container.resolve("singleton"));
}

export function *resolveTransientFactory(_: k_state)
{
    const container = createContainer();
    container.register("transient", asFunction(() => ({}), { lifetime: Lifetime.TRANSIENT }));

    yield () => do_not_optimize(container.resolve("transient"));
}

export function *resolveTransientFactoryChain(_: k_state)
{
    const container = createContainer();
    container.register("leaf", asFunction(() => new Leaf(), { lifetime: Lifetime.TRANSIENT }));
    container.register("middle", asFunction(({ leaf }) => new Middle(leaf), { lifetime: Lifetime.TRANSIENT }));
    container.register("root", asFunction(({ middle }) => new Root(middle), { lifetime: Lifetime.TRANSIENT }));

    yield () => do_not_optimize(container.resolve("root"));
}
