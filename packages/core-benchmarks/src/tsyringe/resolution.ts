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
