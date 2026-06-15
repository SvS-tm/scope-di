// deno-lint-ignore-file no-sloppy-imports
import "reflect-metadata";
import { Container } from "inversify";
import type { k_state } from "mitata";
import { createColdResolutionBenchmark, createWarmResolutionBenchmark } from "../helpers.ts";

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

function createValueContainer()
{
    const container = new Container();
    container.bind("value").toConstantValue({});

    return container;
}

export function *warmResolveValue(_: k_state)
{
    yield *createWarmResolutionBenchmark(createValueContainer(), (container) => container.get("value"));
}

export function *coldResolveValue(_: k_state)
{
    yield *createColdResolutionBenchmark(createValueContainer, (container) => container.get("value"));
}

function createSingletonClassContainer()
{
    const container = new Container();
    container.bind("singleton").to(Leaf).inSingletonScope();

    return container;
}

export function *warmResolveSingletonClass(_: k_state)
{
    yield *createWarmResolutionBenchmark(createSingletonClassContainer(), (container) => container.get("singleton"));
}

export function *coldResolveSingletonClass(_: k_state)
{
    yield *createColdResolutionBenchmark(createSingletonClassContainer, (container) => container.get("singleton"));
}

function createTransientClassContainer()
{
    const container = new Container();
    container.bind("transient").to(Leaf).inTransientScope();

    return container;
}

export function *warmResolveTransientClass(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientClassContainer(), (container) => container.get("transient"));
}

export function *coldResolveTransientClass(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientClassContainer, (container) => container.get("transient"));
}

function createSingletonFactoryContainer()
{
    const value = {};
    const container = new Container();
    container.bind("singleton").toDynamicValue(() => value).inSingletonScope();

    return container;
}

export function *warmResolveSingletonFactory(_: k_state)
{
    yield *createWarmResolutionBenchmark(createSingletonFactoryContainer(), (container) => container.get("singleton"));
}

export function *coldResolveSingletonFactory(_: k_state)
{
    yield *createColdResolutionBenchmark(createSingletonFactoryContainer, (container) => container.get("singleton"));
}

function createTransientFactoryContainer()
{
    const container = new Container();
    container.bind("transient").toDynamicValue(() => ({})).inTransientScope();

    return container;
}

export function *warmResolveTransientFactory(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryContainer(), (container) => container.get("transient"));
}

export function *coldResolveTransientFactory(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryContainer, (container) => container.get("transient"));
}

function createTransientFactoryChainContainer()
{
    const container = new Container();
    container.bind("leaf").toDynamicValue(() => new Leaf()).inTransientScope();
    container.bind("middle").toDynamicValue((context) => new Middle(context.get("leaf") as Leaf)).inTransientScope();
    container.bind("root").toDynamicValue((context) => new Root(context.get("middle") as Middle)).inTransientScope();

    return container;
}

export function *warmResolveTransientFactoryChain(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryChainContainer(), (container) => container.get("root"));
}

export function *coldResolveTransientFactoryChain(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryChainContainer, (container) => container.get("root"));
}

function createTransientFactoryWithFiveDependenciesContainer()
{
    const container = new Container();
    container.bind("a").to(Dependency).inTransientScope();
    container.bind("b").to(Dependency).inTransientScope();
    container.bind("c").to(Dependency).inTransientScope();
    container.bind("d").to(Dependency).inTransientScope();
    container.bind("e").to(Dependency).inTransientScope();
    container.bind("parent").toDynamicValue((context) => ({ a: context.get("a"), b: context.get("b"), c: context.get("c"), d: context.get("d"), e: context.get("e") })).inTransientScope();

    return container;
}

export function *warmResolveTransientFactoryWithFiveDependencies(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryWithFiveDependenciesContainer(), (container) => container.get("parent"));
}

export function *coldResolveTransientFactoryWithFiveDependencies(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryWithFiveDependenciesContainer, (container) => container.get("parent"));
}

function createTransientFactoryWithSixDependenciesContainer()
{
    const container = new Container();
    container.bind("a").to(Dependency).inTransientScope();
    container.bind("b").to(Dependency).inTransientScope();
    container.bind("c").to(Dependency).inTransientScope();
    container.bind("d").to(Dependency).inTransientScope();
    container.bind("e").to(Dependency).inTransientScope();
    container.bind("f").to(Dependency).inTransientScope();
    container.bind("parent").toDynamicValue((context) => ({ a: context.get("a"), b: context.get("b"), c: context.get("c"), d: context.get("d"), e: context.get("e"), f: context.get("f") })).inTransientScope();

    return container;
}

export function *warmResolveTransientFactoryWithSixDependencies(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryWithSixDependenciesContainer(), (container) => container.get("parent"));
}

export function *coldResolveTransientFactoryWithSixDependencies(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryWithSixDependenciesContainer, (container) => container.get("parent"));
}
