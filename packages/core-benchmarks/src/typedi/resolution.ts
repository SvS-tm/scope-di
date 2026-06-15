// deno-lint-ignore-file no-sloppy-imports
import "reflect-metadata";
import { Container } from "typedi";
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

let containerIndex = 0;

function createIsolatedContainer()
{
    return Container.of(`resolution-benchmark-${containerIndex++}`);
}

function createValueContainer()
{
    const container = createIsolatedContainer();
    container.set("value", {});

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
    const container = createIsolatedContainer();
    container.set({ id: "singleton", type: Leaf });

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
    const container = createIsolatedContainer();
    container.set({ id: "transient", type: Leaf, transient: true });

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
    const container = createIsolatedContainer();
    container.set({ id: "singleton", factory: () => value });

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
    const container = createIsolatedContainer();
    container.set({ id: "transient", factory: () => ({}), transient: true });

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
    const container = createIsolatedContainer();
    container.set({ id: "leaf", factory: () => new Leaf(), transient: true });
    container.set({ id: "middle", factory: () => new Middle(container.get("leaf")), transient: true });
    container.set({ id: "root", factory: () => new Root(container.get("middle")), transient: true });

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
    const container = createIsolatedContainer();
    container.set({ id: "a", type: Dependency, transient: true });
    container.set({ id: "b", type: Dependency, transient: true });
    container.set({ id: "c", type: Dependency, transient: true });
    container.set({ id: "d", type: Dependency, transient: true });
    container.set({ id: "e", type: Dependency, transient: true });
    container.set({ id: "parent", factory: () => ({ a: container.get("a"), b: container.get("b"), c: container.get("c"), d: container.get("d"), e: container.get("e") }), transient: true });

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
    const container = createIsolatedContainer();
    container.set({ id: "a", type: Dependency, transient: true });
    container.set({ id: "b", type: Dependency, transient: true });
    container.set({ id: "c", type: Dependency, transient: true });
    container.set({ id: "d", type: Dependency, transient: true });
    container.set({ id: "e", type: Dependency, transient: true });
    container.set({ id: "f", type: Dependency, transient: true });
    container.set({ id: "parent", factory: () => ({ a: container.get("a"), b: container.get("b"), c: container.get("c"), d: container.get("d"), e: container.get("e"), f: container.get("f") }), transient: true });

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
