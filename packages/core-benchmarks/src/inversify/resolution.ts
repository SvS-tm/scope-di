// deno-lint-ignore-file no-sloppy-imports
import "reflect-metadata";
import { Container } from "inversify";
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

export function *resolveValue(_: k_state)
{
    const container = new Container();
    container.bind("value").toConstantValue({});

    yield () => do_not_optimize(container.get("value"));
}

export function *resolveSingletonClass(_: k_state)
{
    const container = new Container();
    container.bind("singleton").to(Leaf).inSingletonScope();
    container.get("singleton");

    yield () => do_not_optimize(container.get("singleton"));
}

export function *resolveTransientClass(_: k_state)
{
    const container = new Container();
    container.bind("transient").to(Leaf).inTransientScope();

    yield () => do_not_optimize(container.get("transient"));
}

export function *resolveSingletonFactory(_: k_state)
{
    const value = {};
    const container = new Container();
    container.bind("singleton").toDynamicValue(() => value).inSingletonScope();
    container.get("singleton");

    yield () => do_not_optimize(container.get("singleton"));
}

export function *resolveTransientFactory(_: k_state)
{
    const container = new Container();
    container.bind("transient").toDynamicValue(() => ({})).inTransientScope();

    yield () => do_not_optimize(container.get("transient"));
}

export function *resolveTransientFactoryChain(_: k_state)
{
    const container = new Container();
    container.bind("leaf").toDynamicValue(() => new Leaf()).inTransientScope();
    container.bind("middle").toDynamicValue((context) => new Middle(context.get("leaf") as Leaf)).inTransientScope();
    container.bind("root").toDynamicValue((context) => new Root(context.get("middle") as Middle)).inTransientScope();

    yield () => do_not_optimize(container.get("root"));
}

export function *resolveTransientFactoryWithFiveDependencies(_: k_state)
{
    const container = new Container();
    container.bind("a").to(Dependency).inTransientScope();
    container.bind("b").to(Dependency).inTransientScope();
    container.bind("c").to(Dependency).inTransientScope();
    container.bind("d").to(Dependency).inTransientScope();
    container.bind("e").to(Dependency).inTransientScope();
    container.bind("parent").toDynamicValue((context) => ({ a: context.get("a"), b: context.get("b"), c: context.get("c"), d: context.get("d"), e: context.get("e") })).inTransientScope();

    yield () => do_not_optimize(container.get("parent"));
}

export function *resolveTransientFactoryWithSixDependencies(_: k_state)
{
    const container = new Container();
    container.bind("a").to(Dependency).inTransientScope();
    container.bind("b").to(Dependency).inTransientScope();
    container.bind("c").to(Dependency).inTransientScope();
    container.bind("d").to(Dependency).inTransientScope();
    container.bind("e").to(Dependency).inTransientScope();
    container.bind("f").to(Dependency).inTransientScope();
    container.bind("parent").toDynamicValue((context) => ({ a: context.get("a"), b: context.get("b"), c: context.get("c"), d: context.get("d"), e: context.get("e"), f: context.get("f") })).inTransientScope();

    yield () => do_not_optimize(container.get("parent"));
}
