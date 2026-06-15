// deno-lint-ignore-file no-sloppy-imports
import { asClass, asFunction, asValue, createContainer, Lifetime } from "awilix";
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
    const container = createContainer();
    container.register("value", asValue({}));

    return container;
}

export function *warmResolveValue(_: k_state)
{
    yield *createWarmResolutionBenchmark(createValueContainer(), (container) => container.resolve("value"));
}

export function *coldResolveValue(_: k_state)
{
    yield *createColdResolutionBenchmark(createValueContainer, (container) => container.resolve("value"));
}

function createSingletonClassContainer()
{
    const container = createContainer();
    container.register("singleton", asClass(Leaf, { lifetime: Lifetime.SINGLETON }));

    return container;
}

export function *warmResolveSingletonClass(_: k_state)
{
    yield *createWarmResolutionBenchmark(createSingletonClassContainer(), (container) => container.resolve("singleton"));
}

export function *coldResolveSingletonClass(_: k_state)
{
    yield *createColdResolutionBenchmark(createSingletonClassContainer, (container) => container.resolve("singleton"));
}

function createTransientClassContainer()
{
    const container = createContainer();
    container.register("transient", asClass(Leaf, { lifetime: Lifetime.TRANSIENT }));

    return container;
}

export function *warmResolveTransientClass(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientClassContainer(), (container) => container.resolve("transient"));
}

export function *coldResolveTransientClass(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientClassContainer, (container) => container.resolve("transient"));
}

function createSingletonFactoryContainer()
{
    const value = {};
    const container = createContainer();
    container.register("singleton", asFunction(() => value, { lifetime: Lifetime.SINGLETON }));

    return container;
}

export function *warmResolveSingletonFactory(_: k_state)
{
    yield *createWarmResolutionBenchmark(createSingletonFactoryContainer(), (container) => container.resolve("singleton"));
}

export function *coldResolveSingletonFactory(_: k_state)
{
    yield *createColdResolutionBenchmark(createSingletonFactoryContainer, (container) => container.resolve("singleton"));
}

function createTransientFactoryContainer()
{
    const container = createContainer();
    container.register("transient", asFunction(() => ({}), { lifetime: Lifetime.TRANSIENT }));

    return container;
}

export function *warmResolveTransientFactory(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryContainer(), (container) => container.resolve("transient"));
}

export function *coldResolveTransientFactory(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryContainer, (container) => container.resolve("transient"));
}

function createTransientFactoryChainContainer()
{
    const container = createContainer();
    container.register("leaf", asFunction(() => new Leaf(), { lifetime: Lifetime.TRANSIENT }));
    container.register("middle", asFunction(({ leaf }) => new Middle(leaf), { lifetime: Lifetime.TRANSIENT }));
    container.register("root", asFunction(({ middle }) => new Root(middle), { lifetime: Lifetime.TRANSIENT }));

    return container;
}

export function *warmResolveTransientFactoryChain(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryChainContainer(), (container) => container.resolve("root"));
}

export function *coldResolveTransientFactoryChain(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryChainContainer, (container) => container.resolve("root"));
}

function createTransientFactoryWithFiveDependenciesContainer()
{
    const container = createContainer();
    container.register("a", asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
    container.register("b", asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
    container.register("c", asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
    container.register("d", asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
    container.register("e", asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
    container.register("parent", asFunction(({ a, b, c, d, e }) => ({ a, b, c, d, e }), { lifetime: Lifetime.TRANSIENT }));

    return container;
}

export function *warmResolveTransientFactoryWithFiveDependencies(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryWithFiveDependenciesContainer(), (container) => container.resolve("parent"));
}

export function *coldResolveTransientFactoryWithFiveDependencies(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryWithFiveDependenciesContainer, (container) => container.resolve("parent"));
}

function createTransientFactoryWithSixDependenciesContainer()
{
    const container = createContainer();
    container.register("a", asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
    container.register("b", asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
    container.register("c", asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
    container.register("d", asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
    container.register("e", asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
    container.register("f", asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
    container.register("parent", asFunction(({ a, b, c, d, e, f }) => ({ a, b, c, d, e, f }), { lifetime: Lifetime.TRANSIENT }));

    return container;
}

export function *warmResolveTransientFactoryWithSixDependencies(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryWithSixDependenciesContainer(), (container) => container.resolve("parent"));
}

export function *coldResolveTransientFactoryWithSixDependencies(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryWithSixDependenciesContainer, (container) => container.resolve("parent"));
}

function createTransientFactoryDeepChainContainer()
{
    const container = createContainer();
    container.register("leaf", asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
    container.register("level1", asFunction(({ leaf }) => ({ leaf }), { lifetime: Lifetime.TRANSIENT }));
    container.register("level2", asFunction(({ level1 }) => ({ level1 }), { lifetime: Lifetime.TRANSIENT }));
    container.register("level3", asFunction(({ level2 }) => ({ level2 }), { lifetime: Lifetime.TRANSIENT }));
    container.register("level4", asFunction(({ level3 }) => ({ level3 }), { lifetime: Lifetime.TRANSIENT }));
    container.register("root", asFunction(({ level4 }) => ({ level4 }), { lifetime: Lifetime.TRANSIENT }));

    return container;
}

export function *warmResolveTransientFactoryDeepChain(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryDeepChainContainer(), (container) => container.resolve("root"));
}

export function *coldResolveTransientFactoryDeepChain(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryDeepChainContainer, (container) => container.resolve("root"));
}

function createTransientFactoryWithTenDependenciesContainer()
{
    const container = createContainer();
    for(const key of ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])
    {
        container.register(key, asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
    }

    container.register("parent", asFunction(({ a, b, c, d, e, f, g, h, i, j }) => ({ a, b, c, d, e, f, g, h, i, j }), { lifetime: Lifetime.TRANSIENT }));

    return container;
}

export function *warmResolveTransientFactoryWithTenDependencies(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryWithTenDependenciesContainer(), (container) => container.resolve("parent"));
}

export function *coldResolveTransientFactoryWithTenDependencies(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryWithTenDependenciesContainer, (container) => container.resolve("parent"));
}

function createTransientFactoryDeepWideGraphContainer()
{
    const container = createContainer();
    for(const prefix of ["a", "b", "c", "d", "e"])
    {
        for(let index = 1; index <= 5; index++)
        {
            container.register(`${prefix}${index}`, asClass(Dependency, { lifetime: Lifetime.TRANSIENT }));
        }
    }

    container.register("a", asFunction(({ a1, a2, a3, a4, a5 }) => ({ a1, a2, a3, a4, a5 }), { lifetime: Lifetime.TRANSIENT }));
    container.register("b", asFunction(({ b1, b2, b3, b4, b5 }) => ({ b1, b2, b3, b4, b5 }), { lifetime: Lifetime.TRANSIENT }));
    container.register("c", asFunction(({ c1, c2, c3, c4, c5 }) => ({ c1, c2, c3, c4, c5 }), { lifetime: Lifetime.TRANSIENT }));
    container.register("d", asFunction(({ d1, d2, d3, d4, d5 }) => ({ d1, d2, d3, d4, d5 }), { lifetime: Lifetime.TRANSIENT }));
    container.register("e", asFunction(({ e1, e2, e3, e4, e5 }) => ({ e1, e2, e3, e4, e5 }), { lifetime: Lifetime.TRANSIENT }));
    container.register("root", asFunction(({ a, b, c, d, e }) => ({ a, b, c, d, e }), { lifetime: Lifetime.TRANSIENT }));

    return container;
}

export function *warmResolveTransientFactoryDeepWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryDeepWideGraphContainer(), (container) => container.resolve("root"));
}

export function *coldResolveTransientFactoryDeepWideGraph(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryDeepWideGraphContainer, (container) => container.resolve("root"));
}

function createCachedFactoryWideGraphContainer()
{
    const container = createContainer();
    for(const key of ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])
    {
        container.register(key, asClass(Dependency, { lifetime: Lifetime.SINGLETON }));
    }

    container.register("root", asFunction(({ a, b, c, d, e, f, g, h, i, j }) => ({ a, b, c, d, e, f, g, h, i, j }), { lifetime: Lifetime.TRANSIENT }));

    return container;
}

export function *warmResolveCachedFactoryWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createCachedFactoryWideGraphContainer(), (container) => container.resolve("root"));
}

function createCachedFactoryDeepWideGraphContainer()
{
    const container = createContainer();
    for(const prefix of ["a", "b", "c", "d", "e"])
    {
        for(let index = 1; index <= 5; index++)
        {
            container.register(`${prefix}${index}`, asClass(Dependency, { lifetime: Lifetime.SINGLETON }));
        }
    }

    container.register("a", asFunction(({ a1, a2, a3, a4, a5 }) => ({ a1, a2, a3, a4, a5 }), { lifetime: Lifetime.TRANSIENT }));
    container.register("b", asFunction(({ b1, b2, b3, b4, b5 }) => ({ b1, b2, b3, b4, b5 }), { lifetime: Lifetime.TRANSIENT }));
    container.register("c", asFunction(({ c1, c2, c3, c4, c5 }) => ({ c1, c2, c3, c4, c5 }), { lifetime: Lifetime.TRANSIENT }));
    container.register("d", asFunction(({ d1, d2, d3, d4, d5 }) => ({ d1, d2, d3, d4, d5 }), { lifetime: Lifetime.TRANSIENT }));
    container.register("e", asFunction(({ e1, e2, e3, e4, e5 }) => ({ e1, e2, e3, e4, e5 }), { lifetime: Lifetime.TRANSIENT }));
    container.register("root", asFunction(({ a, b, c, d, e }) => ({ a, b, c, d, e }), { lifetime: Lifetime.TRANSIENT }));

    return container;
}

export function *warmResolveCachedFactoryDeepWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createCachedFactoryDeepWideGraphContainer(), (container) => container.resolve("root"));
}
