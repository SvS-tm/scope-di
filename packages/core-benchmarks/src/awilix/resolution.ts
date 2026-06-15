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
