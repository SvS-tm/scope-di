// deno-lint-ignore-file no-sloppy-imports
import { Container } from "@needle-di/core";
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

class ValueToken {}
class SingletonToken {}
class TransientToken {}
class SingletonFactoryToken {}
class TransientFactoryToken {}

export function *resolveValue(_: k_state)
{
    const container = new Container();
    container.bind({ provide: ValueToken, useValue: {} });

    yield () => do_not_optimize(container.get(ValueToken));
}

export function *resolveSingletonClass(_: k_state)
{
    const container = new Container();
    container.bind({ provide: SingletonToken, useClass: Leaf });
    container.get(SingletonToken);

    yield () => do_not_optimize(container.get(SingletonToken));
}

export function *resolveTransientClass(_: k_state)
{
    const container = new Container();
    container.bind({ provide: TransientToken, useFactory: () => new Leaf() });

    yield () => do_not_optimize(container.get(TransientToken));
}

export function *resolveSingletonFactory(_: k_state)
{
    const value = {};
    const container = new Container();
    container.bind({ provide: SingletonFactoryToken, useFactory: () => value });
    container.get(SingletonFactoryToken);

    yield () => do_not_optimize(container.get(SingletonFactoryToken));
}

export function *resolveTransientFactory(_: k_state)
{
    const container = new Container();
    container.bind({ provide: TransientFactoryToken, useFactory: () => ({}) });

    yield () => do_not_optimize(container.get(TransientFactoryToken));
}

export function *resolveTransientFactoryChain(_: k_state)
{
    const container = new Container();
    container.bind({ provide: Leaf, useFactory: () => new Leaf() });
    container.bind({ provide: Middle, useFactory: (container) => new Middle(container.get(Leaf)) });
    container.bind({ provide: Root, useFactory: (container) => new Root(container.get(Middle)) });

    yield () => do_not_optimize(container.get(Root));
}
