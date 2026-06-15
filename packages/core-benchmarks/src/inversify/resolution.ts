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

function createTransientFactoryDeepChainContainer()
{
    const container = new Container();
    container.bind("leaf").to(Dependency).inTransientScope();
    container.bind("level1").toDynamicValue((context) => ({ leaf: context.get("leaf") })).inTransientScope();
    container.bind("level2").toDynamicValue((context) => ({ level1: context.get("level1") })).inTransientScope();
    container.bind("level3").toDynamicValue((context) => ({ level2: context.get("level2") })).inTransientScope();
    container.bind("level4").toDynamicValue((context) => ({ level3: context.get("level3") })).inTransientScope();
    container.bind("root").toDynamicValue((context) => ({ level4: context.get("level4") })).inTransientScope();

    return container;
}

export function *warmResolveTransientFactoryDeepChain(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryDeepChainContainer(), (container) => container.get("root"));
}

export function *coldResolveTransientFactoryDeepChain(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryDeepChainContainer, (container) => container.get("root"));
}

function createTransientFactoryWithTenDependenciesContainer()
{
    const container = new Container();
    for(const key of ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])
    {
        container.bind(key).to(Dependency).inTransientScope();
    }

    container.bind("parent").toDynamicValue((context) => ({ a: context.get("a"), b: context.get("b"), c: context.get("c"), d: context.get("d"), e: context.get("e"), f: context.get("f"), g: context.get("g"), h: context.get("h"), i: context.get("i"), j: context.get("j") })).inTransientScope();

    return container;
}

export function *warmResolveTransientFactoryWithTenDependencies(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryWithTenDependenciesContainer(), (container) => container.get("parent"));
}

export function *coldResolveTransientFactoryWithTenDependencies(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryWithTenDependenciesContainer, (container) => container.get("parent"));
}

function createTransientFactoryDeepWideGraphContainer()
{
    const container = new Container();
    for(const prefix of ["a", "b", "c", "d", "e"])
    {
        for(let index = 1; index <= 5; index++)
        {
            container.bind(`${prefix}${index}`).to(Dependency).inTransientScope();
        }
    }

    container.bind("a").toDynamicValue((context) => ({ a1: context.get("a1"), a2: context.get("a2"), a3: context.get("a3"), a4: context.get("a4"), a5: context.get("a5") })).inTransientScope();
    container.bind("b").toDynamicValue((context) => ({ b1: context.get("b1"), b2: context.get("b2"), b3: context.get("b3"), b4: context.get("b4"), b5: context.get("b5") })).inTransientScope();
    container.bind("c").toDynamicValue((context) => ({ c1: context.get("c1"), c2: context.get("c2"), c3: context.get("c3"), c4: context.get("c4"), c5: context.get("c5") })).inTransientScope();
    container.bind("d").toDynamicValue((context) => ({ d1: context.get("d1"), d2: context.get("d2"), d3: context.get("d3"), d4: context.get("d4"), d5: context.get("d5") })).inTransientScope();
    container.bind("e").toDynamicValue((context) => ({ e1: context.get("e1"), e2: context.get("e2"), e3: context.get("e3"), e4: context.get("e4"), e5: context.get("e5") })).inTransientScope();
    container.bind("root").toDynamicValue((context) => ({ a: context.get("a"), b: context.get("b"), c: context.get("c"), d: context.get("d"), e: context.get("e") })).inTransientScope();

    return container;
}

export function *warmResolveTransientFactoryDeepWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryDeepWideGraphContainer(), (container) => container.get("root"));
}

export function *coldResolveTransientFactoryDeepWideGraph(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryDeepWideGraphContainer, (container) => container.get("root"));
}

function createCachedFactoryWideGraphContainer()
{
    const container = new Container();
    for(const key of ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])
    {
        container.bind(key).to(Dependency).inSingletonScope();
    }

    container.bind("root").toDynamicValue((context) => ({ a: context.get("a"), b: context.get("b"), c: context.get("c"), d: context.get("d"), e: context.get("e"), f: context.get("f"), g: context.get("g"), h: context.get("h"), i: context.get("i"), j: context.get("j") })).inTransientScope();

    return container;
}

export function *warmResolveCachedFactoryWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createCachedFactoryWideGraphContainer(), (container) => container.get("root"));
}

function createCachedFactoryDeepWideGraphContainer()
{
    const container = new Container();
    for(const prefix of ["a", "b", "c", "d", "e"])
    {
        for(let index = 1; index <= 5; index++)
        {
            container.bind(`${prefix}${index}`).to(Dependency).inSingletonScope();
        }
    }

    container.bind("a").toDynamicValue((context) => ({ a1: context.get("a1"), a2: context.get("a2"), a3: context.get("a3"), a4: context.get("a4"), a5: context.get("a5") })).inTransientScope();
    container.bind("b").toDynamicValue((context) => ({ b1: context.get("b1"), b2: context.get("b2"), b3: context.get("b3"), b4: context.get("b4"), b5: context.get("b5") })).inTransientScope();
    container.bind("c").toDynamicValue((context) => ({ c1: context.get("c1"), c2: context.get("c2"), c3: context.get("c3"), c4: context.get("c4"), c5: context.get("c5") })).inTransientScope();
    container.bind("d").toDynamicValue((context) => ({ d1: context.get("d1"), d2: context.get("d2"), d3: context.get("d3"), d4: context.get("d4"), d5: context.get("d5") })).inTransientScope();
    container.bind("e").toDynamicValue((context) => ({ e1: context.get("e1"), e2: context.get("e2"), e3: context.get("e3"), e4: context.get("e4"), e5: context.get("e5") })).inTransientScope();
    container.bind("root").toDynamicValue((context) => ({ a: context.get("a"), b: context.get("b"), c: context.get("c"), d: context.get("d"), e: context.get("e") })).inTransientScope();

    return container;
}

export function *warmResolveCachedFactoryDeepWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createCachedFactoryDeepWideGraphContainer(), (container) => container.get("root"));
}
