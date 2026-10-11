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

function createValueContainer(jitEnabled = false)
{
    const container = new Container({ jitless: !jitEnabled });
    container.bind("value").toConstantValue({});

    return container;
}

export function *warmResolveValue(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createValueContainer(jitEnabled), (container) => container.get("value"));
}

export function *coldResolveValue(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createValueContainer(jitEnabled), (container) => container.get("value"));
}

function createSingletonClassContainer(jitEnabled = false)
{
    const container = new Container({ jitless: !jitEnabled });
    container.bind("singleton").to(Leaf).inSingletonScope();

    return container;
}

export function *warmResolveSingletonClass(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createSingletonClassContainer(jitEnabled), (container) => container.get("singleton"));
}

export function *coldResolveSingletonClass(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createSingletonClassContainer(jitEnabled), (container) => container.get("singleton"));
}

function createTransientClassContainer(jitEnabled = false)
{
    const container = new Container({ jitless: !jitEnabled });
    container.bind("transient").to(Leaf).inTransientScope();

    return container;
}

export function *warmResolveTransientClass(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientClassContainer(jitEnabled), (container) => container.get("transient"));
}

export function *coldResolveTransientClass(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientClassContainer(jitEnabled), (container) => container.get("transient"));
}

function createSingletonFactoryContainer(jitEnabled = false)
{
    const value = {};
    const container = new Container({ jitless: !jitEnabled });
    container.bind("singleton").toDynamicValue(() => value).inSingletonScope();

    return container;
}

export function *warmResolveSingletonFactory(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createSingletonFactoryContainer(jitEnabled), (container) => container.get("singleton"));
}

export function *coldResolveSingletonFactory(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createSingletonFactoryContainer(jitEnabled), (container) => container.get("singleton"));
}

function createTransientFactoryContainer(jitEnabled = false)
{
    const container = new Container({ jitless: !jitEnabled });
    container.bind("transient").toDynamicValue(() => ({})).inTransientScope();

    return container;
}

export function *warmResolveTransientFactory(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryContainer(jitEnabled), (container) => container.get("transient"));
}

export function *coldResolveTransientFactory(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryContainer(jitEnabled), (container) => container.get("transient"));
}

function createTransientFactoryChainContainer(jitEnabled = false)
{
    const container = new Container({ jitless: !jitEnabled });
    container.bind("leaf").toDynamicValue(() => new Leaf()).inTransientScope();
    container.bind("middle").toDynamicValue((context) => new Middle(context.get("leaf") as Leaf)).inTransientScope();
    container.bind("root").toDynamicValue((context) => new Root(context.get("middle") as Middle)).inTransientScope();

    return container;
}

export function *warmResolveTransientFactoryChain(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryChainContainer(jitEnabled), (container) => container.get("root"));
}

export function *coldResolveTransientFactoryChain(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryChainContainer(jitEnabled), (container) => container.get("root"));
}

function createTransientFactoryWithFiveDependenciesContainer(jitEnabled = false)
{
    const container = new Container({ jitless: !jitEnabled });
    container.bind("a").to(Dependency).inTransientScope();
    container.bind("b").to(Dependency).inTransientScope();
    container.bind("c").to(Dependency).inTransientScope();
    container.bind("d").to(Dependency).inTransientScope();
    container.bind("e").to(Dependency).inTransientScope();
    container.bind("parent").toDynamicValue((context) => ({ a: context.get("a"), b: context.get("b"), c: context.get("c"), d: context.get("d"), e: context.get("e") })).inTransientScope();

    return container;
}

export function *warmResolveTransientFactoryWithFiveDependencies(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryWithFiveDependenciesContainer(jitEnabled), (container) => container.get("parent"));
}

export function *coldResolveTransientFactoryWithFiveDependencies(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryWithFiveDependenciesContainer(jitEnabled), (container) => container.get("parent"));
}

function createTransientFactoryWithSixDependenciesContainer(jitEnabled = false)
{
    const container = new Container({ jitless: !jitEnabled });
    container.bind("a").to(Dependency).inTransientScope();
    container.bind("b").to(Dependency).inTransientScope();
    container.bind("c").to(Dependency).inTransientScope();
    container.bind("d").to(Dependency).inTransientScope();
    container.bind("e").to(Dependency).inTransientScope();
    container.bind("f").to(Dependency).inTransientScope();
    container.bind("parent").toDynamicValue((context) => ({ a: context.get("a"), b: context.get("b"), c: context.get("c"), d: context.get("d"), e: context.get("e"), f: context.get("f") })).inTransientScope();

    return container;
}

export function *warmResolveTransientFactoryWithSixDependencies(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryWithSixDependenciesContainer(jitEnabled), (container) => container.get("parent"));
}

export function *coldResolveTransientFactoryWithSixDependencies(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryWithSixDependenciesContainer(jitEnabled), (container) => container.get("parent"));
}

function createTransientFactoryDeepChainContainer(jitEnabled = false)
{
    const container = new Container({ jitless: !jitEnabled });
    container.bind("leaf").to(Dependency).inTransientScope();
    container.bind("level1").toDynamicValue((context) => ({ leaf: context.get("leaf") })).inTransientScope();
    container.bind("level2").toDynamicValue((context) => ({ level1: context.get("level1") })).inTransientScope();
    container.bind("level3").toDynamicValue((context) => ({ level2: context.get("level2") })).inTransientScope();
    container.bind("level4").toDynamicValue((context) => ({ level3: context.get("level3") })).inTransientScope();
    container.bind("root").toDynamicValue((context) => ({ level4: context.get("level4") })).inTransientScope();

    return container;
}

export function *warmResolveTransientFactoryDeepChain(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryDeepChainContainer(jitEnabled), (container) => container.get("root"));
}

export function *coldResolveTransientFactoryDeepChain(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryDeepChainContainer(jitEnabled), (container) => container.get("root"));
}

function createTransientFactoryWithTenDependenciesContainer(jitEnabled = false)
{
    const container = new Container({ jitless: !jitEnabled });
    for(const key of ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])
    {
        container.bind(key).to(Dependency).inTransientScope();
    }

    container.bind("parent").toDynamicValue((context) => ({ a: context.get("a"), b: context.get("b"), c: context.get("c"), d: context.get("d"), e: context.get("e"), f: context.get("f"), g: context.get("g"), h: context.get("h"), i: context.get("i"), j: context.get("j") })).inTransientScope();

    return container;
}

export function *warmResolveTransientFactoryWithTenDependencies(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryWithTenDependenciesContainer(jitEnabled), (container) => container.get("parent"));
}

export function *coldResolveTransientFactoryWithTenDependencies(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryWithTenDependenciesContainer(jitEnabled), (container) => container.get("parent"));
}

function createTransientFactoryDeepWideGraphContainer(jitEnabled = false)
{
    const container = new Container({ jitless: !jitEnabled });
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

export function *warmResolveTransientFactoryDeepWideGraph(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryDeepWideGraphContainer(jitEnabled), (container) => container.get("root"));
}

export function *coldResolveTransientFactoryDeepWideGraph(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryDeepWideGraphContainer(jitEnabled), (container) => container.get("root"));
}

function createCachedFactoryWideGraphContainer(jitEnabled = false)
{
    const container = new Container({ jitless: !jitEnabled });
    for(const key of ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])
    {
        container.bind(key).to(Dependency).inSingletonScope();
    }

    container.bind("root").toDynamicValue((context) => ({ a: context.get("a"), b: context.get("b"), c: context.get("c"), d: context.get("d"), e: context.get("e"), f: context.get("f"), g: context.get("g"), h: context.get("h"), i: context.get("i"), j: context.get("j") })).inTransientScope();

    return container;
}

export function *warmResolveCachedFactoryWideGraph(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createCachedFactoryWideGraphContainer(jitEnabled), (container) => container.get("root"));
}

function createCachedFactoryDeepWideGraphContainer(jitEnabled = false)
{
    const container = new Container({ jitless: !jitEnabled });
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

export function *warmResolveCachedFactoryDeepWideGraph(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createCachedFactoryDeepWideGraphContainer(jitEnabled), (container) => container.get("root"));
}
