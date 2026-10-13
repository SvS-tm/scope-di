// deno-lint-ignore-file no-sloppy-imports
import "reflect-metadata";
import { Container } from "inversify";
import type { k_state } from "mitata";
import { createChangingShapeFactory } from "../changing-shape-factory.ts";
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
    container.bind("singleton").toResolvedValue(() => value).inSingletonScope();

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
    container.bind("transient").toResolvedValue(() => ({})).inTransientScope();

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
    container.bind("leaf").toResolvedValue(() => new Leaf()).inTransientScope();
    container.bind("middle").toResolvedValue((leaf: Leaf) => new Middle(leaf), ["leaf"]).inTransientScope();
    container.bind("root").toResolvedValue((middle: Middle) => new Root(middle), ["middle"]).inTransientScope();

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
    container.bind("parent").toResolvedValue((a, b, c, d, e) => ({ a, b, c, d, e }), ["a", "b", "c", "d", "e"]).inTransientScope();

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
    container.bind("parent").toResolvedValue((a, b, c, d, e, f) => ({ a, b, c, d, e, f }), ["a", "b", "c", "d", "e", "f"]).inTransientScope();

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
    container.bind("level1").toResolvedValue((leaf) => ({ leaf }), ["leaf"]).inTransientScope();
    container.bind("level2").toResolvedValue((level1) => ({ level1 }), ["level1"]).inTransientScope();
    container.bind("level3").toResolvedValue((level2) => ({ level2 }), ["level2"]).inTransientScope();
    container.bind("level4").toResolvedValue((level3) => ({ level3 }), ["level3"]).inTransientScope();
    container.bind("root").toResolvedValue((level4) => ({ level4 }), ["level4"]).inTransientScope();

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

    container.bind("parent").toResolvedValue((a, b, c, d, e, f, g, h, i, j) => ({ a, b, c, d, e, f, g, h, i, j }), ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]).inTransientScope();

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

    container.bind("a").toResolvedValue((a1, a2, a3, a4, a5) => ({ a1, a2, a3, a4, a5 }), ["a1", "a2", "a3", "a4", "a5"]).inTransientScope();
    container.bind("b").toResolvedValue((b1, b2, b3, b4, b5) => ({ b1, b2, b3, b4, b5 }), ["b1", "b2", "b3", "b4", "b5"]).inTransientScope();
    container.bind("c").toResolvedValue((c1, c2, c3, c4, c5) => ({ c1, c2, c3, c4, c5 }), ["c1", "c2", "c3", "c4", "c5"]).inTransientScope();
    container.bind("d").toResolvedValue((d1, d2, d3, d4, d5) => ({ d1, d2, d3, d4, d5 }), ["d1", "d2", "d3", "d4", "d5"]).inTransientScope();
    container.bind("e").toResolvedValue((e1, e2, e3, e4, e5) => ({ e1, e2, e3, e4, e5 }), ["e1", "e2", "e3", "e4", "e5"]).inTransientScope();
    container.bind("root").toResolvedValue((a, b, c, d, e) => ({ a, b, c, d, e }), ["a", "b", "c", "d", "e"]).inTransientScope();

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

    container.bind("root").toResolvedValue((a, b, c, d, e, f, g, h, i, j) => ({ a, b, c, d, e, f, g, h, i, j }), ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]).inTransientScope();

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

    container.bind("a").toResolvedValue((a1, a2, a3, a4, a5) => ({ a1, a2, a3, a4, a5 }), ["a1", "a2", "a3", "a4", "a5"]).inTransientScope();
    container.bind("b").toResolvedValue((b1, b2, b3, b4, b5) => ({ b1, b2, b3, b4, b5 }), ["b1", "b2", "b3", "b4", "b5"]).inTransientScope();
    container.bind("c").toResolvedValue((c1, c2, c3, c4, c5) => ({ c1, c2, c3, c4, c5 }), ["c1", "c2", "c3", "c4", "c5"]).inTransientScope();
    container.bind("d").toResolvedValue((d1, d2, d3, d4, d5) => ({ d1, d2, d3, d4, d5 }), ["d1", "d2", "d3", "d4", "d5"]).inTransientScope();
    container.bind("e").toResolvedValue((e1, e2, e3, e4, e5) => ({ e1, e2, e3, e4, e5 }), ["e1", "e2", "e3", "e4", "e5"]).inTransientScope();
    container.bind("root").toResolvedValue((a, b, c, d, e) => ({ a, b, c, d, e }), ["a", "b", "c", "d", "e"]).inTransientScope();

    return container;
}

export function *warmResolveCachedFactoryDeepWideGraph(state: k_state)
{
    const jitEnabled = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createCachedFactoryDeepWideGraphContainer(jitEnabled), (container) => container.get("root"));
}

export function *warmResolveTransientFactoryWithChangingShape(state: k_state)
{
    const container = new Container({ jitless: state.get("codeGeneration") !== true });
    container.bind("transient").toResolvedValue(createChangingShapeFactory()).inTransientScope();
    yield *createWarmResolutionBenchmark(container, current => current.get("transient"));
}
