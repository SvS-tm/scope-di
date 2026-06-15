// deno-lint-ignore-file no-sloppy-imports
import "reflect-metadata";
import { container, type DependencyContainer, instanceCachingFactory, Lifecycle } from "tsyringe";
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

function createIsolatedContainer(): DependencyContainer
{
    return container.createChildContainer();
}

function createValueContainer()
{
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("value", { useValue: {} });

    return isolatedContainer;
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
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("singleton", { useClass: Leaf }, { lifecycle: Lifecycle.Singleton });

    return isolatedContainer;
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
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("transient", { useClass: Leaf }, { lifecycle: Lifecycle.Transient });

    return isolatedContainer;
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
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("singleton", { useFactory: instanceCachingFactory(() => value) });

    return isolatedContainer;
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
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("transient", { useFactory: () => ({}) });

    return isolatedContainer;
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
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("leaf", { useFactory: () => new Leaf() });
    isolatedContainer.register("middle", { useFactory: (container: DependencyContainer) => new Middle(container.resolve("leaf")) });
    isolatedContainer.register("root", { useFactory: (container: DependencyContainer) => new Root(container.resolve("middle")) });

    return isolatedContainer;
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
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("a", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("b", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("c", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("d", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("e", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("parent", { useFactory: (container: DependencyContainer) => ({ a: container.resolve("a"), b: container.resolve("b"), c: container.resolve("c"), d: container.resolve("d"), e: container.resolve("e") }) });

    return isolatedContainer;
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
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("a", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("b", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("c", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("d", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("e", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("f", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("parent", { useFactory: (container: DependencyContainer) => ({ a: container.resolve("a"), b: container.resolve("b"), c: container.resolve("c"), d: container.resolve("d"), e: container.resolve("e"), f: container.resolve("f") }) });

    return isolatedContainer;
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
    const isolatedContainer = createIsolatedContainer();
    isolatedContainer.register("leaf", { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    isolatedContainer.register("level1", { useFactory: (container: DependencyContainer) => ({ leaf: container.resolve("leaf") }) });
    isolatedContainer.register("level2", { useFactory: (container: DependencyContainer) => ({ level1: container.resolve("level1") }) });
    isolatedContainer.register("level3", { useFactory: (container: DependencyContainer) => ({ level2: container.resolve("level2") }) });
    isolatedContainer.register("level4", { useFactory: (container: DependencyContainer) => ({ level3: container.resolve("level3") }) });
    isolatedContainer.register("root", { useFactory: (container: DependencyContainer) => ({ level4: container.resolve("level4") }) });

    return isolatedContainer;
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
    const isolatedContainer = createIsolatedContainer();
    for(const key of ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])
    {
        isolatedContainer.register(key, { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
    }

    isolatedContainer.register("parent", { useFactory: (container: DependencyContainer) => ({ a: container.resolve("a"), b: container.resolve("b"), c: container.resolve("c"), d: container.resolve("d"), e: container.resolve("e"), f: container.resolve("f"), g: container.resolve("g"), h: container.resolve("h"), i: container.resolve("i"), j: container.resolve("j") }) });

    return isolatedContainer;
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
    const isolatedContainer = createIsolatedContainer();
    for(const prefix of ["a", "b", "c", "d", "e"])
    {
        for(let index = 1; index <= 5; index++)
        {
            isolatedContainer.register(`${prefix}${index}`, { useClass: Dependency }, { lifecycle: Lifecycle.Transient });
        }
    }

    isolatedContainer.register("a", { useFactory: (container: DependencyContainer) => ({ a1: container.resolve("a1"), a2: container.resolve("a2"), a3: container.resolve("a3"), a4: container.resolve("a4"), a5: container.resolve("a5") }) });
    isolatedContainer.register("b", { useFactory: (container: DependencyContainer) => ({ b1: container.resolve("b1"), b2: container.resolve("b2"), b3: container.resolve("b3"), b4: container.resolve("b4"), b5: container.resolve("b5") }) });
    isolatedContainer.register("c", { useFactory: (container: DependencyContainer) => ({ c1: container.resolve("c1"), c2: container.resolve("c2"), c3: container.resolve("c3"), c4: container.resolve("c4"), c5: container.resolve("c5") }) });
    isolatedContainer.register("d", { useFactory: (container: DependencyContainer) => ({ d1: container.resolve("d1"), d2: container.resolve("d2"), d3: container.resolve("d3"), d4: container.resolve("d4"), d5: container.resolve("d5") }) });
    isolatedContainer.register("e", { useFactory: (container: DependencyContainer) => ({ e1: container.resolve("e1"), e2: container.resolve("e2"), e3: container.resolve("e3"), e4: container.resolve("e4"), e5: container.resolve("e5") }) });
    isolatedContainer.register("root", { useFactory: (container: DependencyContainer) => ({ a: container.resolve("a"), b: container.resolve("b"), c: container.resolve("c"), d: container.resolve("d"), e: container.resolve("e") }) });

    return isolatedContainer;
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
    const isolatedContainer = createIsolatedContainer();
    for(const key of ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])
    {
        isolatedContainer.register(key, { useClass: Dependency }, { lifecycle: Lifecycle.Singleton });
    }

    isolatedContainer.register("root", { useFactory: (container: DependencyContainer) => ({ a: container.resolve("a"), b: container.resolve("b"), c: container.resolve("c"), d: container.resolve("d"), e: container.resolve("e"), f: container.resolve("f"), g: container.resolve("g"), h: container.resolve("h"), i: container.resolve("i"), j: container.resolve("j") }) });

    return isolatedContainer;
}

export function *warmResolveCachedFactoryWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createCachedFactoryWideGraphContainer(), (container) => container.resolve("root"));
}

function createCachedFactoryDeepWideGraphContainer()
{
    const isolatedContainer = createIsolatedContainer();
    for(const prefix of ["a", "b", "c", "d", "e"])
    {
        for(let index = 1; index <= 5; index++)
        {
            isolatedContainer.register(`${prefix}${index}`, { useClass: Dependency }, { lifecycle: Lifecycle.Singleton });
        }
    }

    isolatedContainer.register("a", { useFactory: (container: DependencyContainer) => ({ a1: container.resolve("a1"), a2: container.resolve("a2"), a3: container.resolve("a3"), a4: container.resolve("a4"), a5: container.resolve("a5") }) });
    isolatedContainer.register("b", { useFactory: (container: DependencyContainer) => ({ b1: container.resolve("b1"), b2: container.resolve("b2"), b3: container.resolve("b3"), b4: container.resolve("b4"), b5: container.resolve("b5") }) });
    isolatedContainer.register("c", { useFactory: (container: DependencyContainer) => ({ c1: container.resolve("c1"), c2: container.resolve("c2"), c3: container.resolve("c3"), c4: container.resolve("c4"), c5: container.resolve("c5") }) });
    isolatedContainer.register("d", { useFactory: (container: DependencyContainer) => ({ d1: container.resolve("d1"), d2: container.resolve("d2"), d3: container.resolve("d3"), d4: container.resolve("d4"), d5: container.resolve("d5") }) });
    isolatedContainer.register("e", { useFactory: (container: DependencyContainer) => ({ e1: container.resolve("e1"), e2: container.resolve("e2"), e3: container.resolve("e3"), e4: container.resolve("e4"), e5: container.resolve("e5") }) });
    isolatedContainer.register("root", { useFactory: (container: DependencyContainer) => ({ a: container.resolve("a"), b: container.resolve("b"), c: container.resolve("c"), d: container.resolve("d"), e: container.resolve("e") }) });

    return isolatedContainer;
}

export function *warmResolveCachedFactoryDeepWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createCachedFactoryDeepWideGraphContainer(), (container) => container.resolve("root"));
}
