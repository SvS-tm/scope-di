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

function cleanupIsolatedContainer(container: { readonly id: string })
{
    Container.reset(container.id);
}

function *createColdTypeDiResolutionBenchmark<TContainer extends { readonly id: string }>
(
    createContainer: () => TContainer,
    resolve: (container: TContainer) => unknown
)
{
    yield *createColdResolutionBenchmark(createContainer, resolve, cleanupIsolatedContainer);
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
    yield *createColdTypeDiResolutionBenchmark(createValueContainer, (container) => container.get("value"));
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
    yield *createColdTypeDiResolutionBenchmark(createSingletonClassContainer, (container) => container.get("singleton"));
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
    yield *createColdTypeDiResolutionBenchmark(createTransientClassContainer, (container) => container.get("transient"));
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
    yield *createColdTypeDiResolutionBenchmark(createSingletonFactoryContainer, (container) => container.get("singleton"));
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
    yield *createColdTypeDiResolutionBenchmark(createTransientFactoryContainer, (container) => container.get("transient"));
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
    yield *createColdTypeDiResolutionBenchmark(createTransientFactoryChainContainer, (container) => container.get("root"));
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
    yield *createColdTypeDiResolutionBenchmark(createTransientFactoryWithFiveDependenciesContainer, (container) => container.get("parent"));
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
    yield *createColdTypeDiResolutionBenchmark(createTransientFactoryWithSixDependenciesContainer, (container) => container.get("parent"));
}

function createTransientFactoryDeepChainContainer()
{
    const container = createIsolatedContainer();
    container.set({ id: "leaf", type: Dependency, transient: true });
    container.set({ id: "level1", factory: () => ({ leaf: container.get("leaf") }), transient: true });
    container.set({ id: "level2", factory: () => ({ level1: container.get("level1") }), transient: true });
    container.set({ id: "level3", factory: () => ({ level2: container.get("level2") }), transient: true });
    container.set({ id: "level4", factory: () => ({ level3: container.get("level3") }), transient: true });
    container.set({ id: "root", factory: () => ({ level4: container.get("level4") }), transient: true });

    return container;
}

export function *warmResolveTransientFactoryDeepChain(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryDeepChainContainer(), (container) => container.get("root"));
}

export function *coldResolveTransientFactoryDeepChain(_: k_state)
{
    yield *createColdTypeDiResolutionBenchmark(createTransientFactoryDeepChainContainer, (container) => container.get("root"));
}

function createTransientFactoryWithTenDependenciesContainer()
{
    const container = createIsolatedContainer();
    container.set({ id: "a", type: Dependency, transient: true });
    container.set({ id: "b", type: Dependency, transient: true });
    container.set({ id: "c", type: Dependency, transient: true });
    container.set({ id: "d", type: Dependency, transient: true });
    container.set({ id: "e", type: Dependency, transient: true });
    container.set({ id: "f", type: Dependency, transient: true });
    container.set({ id: "g", type: Dependency, transient: true });
    container.set({ id: "h", type: Dependency, transient: true });
    container.set({ id: "i", type: Dependency, transient: true });
    container.set({ id: "j", type: Dependency, transient: true });
    container.set({ id: "parent", factory: () => ({ a: container.get("a"), b: container.get("b"), c: container.get("c"), d: container.get("d"), e: container.get("e"), f: container.get("f"), g: container.get("g"), h: container.get("h"), i: container.get("i"), j: container.get("j") }), transient: true });

    return container;
}

export function *warmResolveTransientFactoryWithTenDependencies(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryWithTenDependenciesContainer(), (container) => container.get("parent"));
}

export function *coldResolveTransientFactoryWithTenDependencies(_: k_state)
{
    yield *createColdTypeDiResolutionBenchmark(createTransientFactoryWithTenDependenciesContainer, (container) => container.get("parent"));
}

function createTransientFactoryDeepWideGraphContainer()
{
    const container = createIsolatedContainer();
    for(const prefix of ["a", "b", "c", "d", "e"])
        for(let index = 1; index <= 5; index++)
            container.set({ id: `${prefix}${index}`, type: Dependency, transient: true });

    container.set({ id: "a", factory: () => ({ a1: container.get("a1"), a2: container.get("a2"), a3: container.get("a3"), a4: container.get("a4"), a5: container.get("a5") }), transient: true });
    container.set({ id: "b", factory: () => ({ b1: container.get("b1"), b2: container.get("b2"), b3: container.get("b3"), b4: container.get("b4"), b5: container.get("b5") }), transient: true });
    container.set({ id: "c", factory: () => ({ c1: container.get("c1"), c2: container.get("c2"), c3: container.get("c3"), c4: container.get("c4"), c5: container.get("c5") }), transient: true });
    container.set({ id: "d", factory: () => ({ d1: container.get("d1"), d2: container.get("d2"), d3: container.get("d3"), d4: container.get("d4"), d5: container.get("d5") }), transient: true });
    container.set({ id: "e", factory: () => ({ e1: container.get("e1"), e2: container.get("e2"), e3: container.get("e3"), e4: container.get("e4"), e5: container.get("e5") }), transient: true });
    container.set({ id: "root", factory: () => ({ a: container.get("a"), b: container.get("b"), c: container.get("c"), d: container.get("d"), e: container.get("e") }), transient: true });

    return container;
}

export function *warmResolveTransientFactoryDeepWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryDeepWideGraphContainer(), (container) => container.get("root"));
}

export function *coldResolveTransientFactoryDeepWideGraph(_: k_state)
{
    yield *createColdTypeDiResolutionBenchmark(createTransientFactoryDeepWideGraphContainer, (container) => container.get("root"));
}

function createCachedFactoryWideGraphContainer()
{
    const container = createIsolatedContainer();
    for(const key of ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])
        container.set({ id: key, type: Dependency });

    container.set({ id: "root", factory: () => ({ a: container.get("a"), b: container.get("b"), c: container.get("c"), d: container.get("d"), e: container.get("e"), f: container.get("f"), g: container.get("g"), h: container.get("h"), i: container.get("i"), j: container.get("j") }), transient: true });

    return container;
}

export function *warmResolveCachedFactoryWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createCachedFactoryWideGraphContainer(), (container) => container.get("root"));
}

function createCachedFactoryDeepWideGraphContainer()
{
    const container = createIsolatedContainer();
    for(const prefix of ["a", "b", "c", "d", "e"])
        for(let index = 1; index <= 5; index++)
            container.set({ id: `${prefix}${index}`, type: Dependency });

    container.set({ id: "a", factory: () => ({ a1: container.get("a1"), a2: container.get("a2"), a3: container.get("a3"), a4: container.get("a4"), a5: container.get("a5") }), transient: true });
    container.set({ id: "b", factory: () => ({ b1: container.get("b1"), b2: container.get("b2"), b3: container.get("b3"), b4: container.get("b4"), b5: container.get("b5") }), transient: true });
    container.set({ id: "c", factory: () => ({ c1: container.get("c1"), c2: container.get("c2"), c3: container.get("c3"), c4: container.get("c4"), c5: container.get("c5") }), transient: true });
    container.set({ id: "d", factory: () => ({ d1: container.get("d1"), d2: container.get("d2"), d3: container.get("d3"), d4: container.get("d4"), d5: container.get("d5") }), transient: true });
    container.set({ id: "e", factory: () => ({ e1: container.get("e1"), e2: container.get("e2"), e3: container.get("e3"), e4: container.get("e4"), e5: container.get("e5") }), transient: true });
    container.set({ id: "root", factory: () => ({ a: container.get("a"), b: container.get("b"), c: container.get("c"), d: container.get("d"), e: container.get("e") }), transient: true });

    return container;
}

export function *warmResolveCachedFactoryDeepWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createCachedFactoryDeepWideGraphContainer(), (container) => container.get("root"));
}
