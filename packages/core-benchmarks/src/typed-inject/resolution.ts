// deno-lint-ignore-file no-sloppy-imports
import { createInjector, Scope } from "typed-inject";
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

function createLeaf()
{
    return new Leaf();
}

function createMiddle(leaf: Leaf)
{
    return new Middle(leaf);
}
createMiddle.inject = ["leaf"] as const;

function createRoot(middle: Middle)
{
    return new Root(middle);
}
createRoot.inject = ["middle"] as const;

function createDependency()
{
    return new Dependency();
}

function createParentWithFiveDependencies(a: Dependency, b: Dependency, c: Dependency, d: Dependency, e: Dependency)
{
    return { a, b, c, d, e };
}
createParentWithFiveDependencies.inject = ["a", "b", "c", "d", "e"] as const;

function createParentWithSixDependencies(a: Dependency, b: Dependency, c: Dependency, d: Dependency, e: Dependency, f: Dependency)
{
    return { a, b, c, d, e, f };
}
createParentWithSixDependencies.inject = ["a", "b", "c", "d", "e", "f"] as const;

function createValueInjector()
{
    return createInjector()
        .provideValue("value", {});
}

export function *warmResolveValue(_: k_state)
{
    yield *createWarmResolutionBenchmark(createValueInjector(), (injector) => injector.resolve("value"));
}

export function *coldResolveValue(_: k_state)
{
    yield *createColdResolutionBenchmark(createValueInjector, (injector) => injector.resolve("value"));
}

function createSingletonClassInjector()
{
    return createInjector()
        .provideClass("singleton", Leaf, Scope.Singleton);
}

export function *warmResolveSingletonClass(_: k_state)
{
    yield *createWarmResolutionBenchmark(createSingletonClassInjector(), (injector) => injector.resolve("singleton"));
}

export function *coldResolveSingletonClass(_: k_state)
{
    yield *createColdResolutionBenchmark(createSingletonClassInjector, (injector) => injector.resolve("singleton"));
}

function createTransientClassInjector()
{
    return createInjector()
        .provideClass("transient", Leaf, Scope.Transient);
}

export function *warmResolveTransientClass(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientClassInjector(), (injector) => injector.resolve("transient"));
}

export function *coldResolveTransientClass(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientClassInjector, (injector) => injector.resolve("transient"));
}

function createSingletonFactoryInjector()
{
    const value = {};

    return createInjector()
        .provideFactory("singleton", () => value, Scope.Singleton);
}

export function *warmResolveSingletonFactory(_: k_state)
{
    yield *createWarmResolutionBenchmark(createSingletonFactoryInjector(), (injector) => injector.resolve("singleton"));
}

export function *coldResolveSingletonFactory(_: k_state)
{
    yield *createColdResolutionBenchmark(createSingletonFactoryInjector, (injector) => injector.resolve("singleton"));
}

function createTransientFactoryInjector()
{
    return createInjector()
        .provideFactory("transient", () => ({}), Scope.Transient);
}

export function *warmResolveTransientFactory(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryInjector(), (injector) => injector.resolve("transient"));
}

export function *coldResolveTransientFactory(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryInjector, (injector) => injector.resolve("transient"));
}

function createTransientFactoryChainInjector()
{
    return createInjector()
        .provideFactory("leaf", createLeaf, Scope.Transient)
        .provideFactory("middle", createMiddle, Scope.Transient)
        .provideFactory("root", createRoot, Scope.Transient);
}

export function *warmResolveTransientFactoryChain(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryChainInjector(), (injector) => injector.resolve("root"));
}

export function *coldResolveTransientFactoryChain(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryChainInjector, (injector) => injector.resolve("root"));
}

function createTransientFactoryWithFiveDependenciesInjector()
{
    return createInjector()
        .provideFactory("a", createDependency, Scope.Transient)
        .provideFactory("b", createDependency, Scope.Transient)
        .provideFactory("c", createDependency, Scope.Transient)
        .provideFactory("d", createDependency, Scope.Transient)
        .provideFactory("e", createDependency, Scope.Transient)
        .provideFactory("parent", createParentWithFiveDependencies, Scope.Transient);
}

export function *warmResolveTransientFactoryWithFiveDependencies(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryWithFiveDependenciesInjector(), (injector) => injector.resolve("parent"));
}

export function *coldResolveTransientFactoryWithFiveDependencies(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryWithFiveDependenciesInjector, (injector) => injector.resolve("parent"));
}

function createTransientFactoryWithSixDependenciesInjector()
{
    return createInjector()
        .provideFactory("a", createDependency, Scope.Transient)
        .provideFactory("b", createDependency, Scope.Transient)
        .provideFactory("c", createDependency, Scope.Transient)
        .provideFactory("d", createDependency, Scope.Transient)
        .provideFactory("e", createDependency, Scope.Transient)
        .provideFactory("f", createDependency, Scope.Transient)
        .provideFactory("parent", createParentWithSixDependencies, Scope.Transient);
}

export function *warmResolveTransientFactoryWithSixDependencies(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryWithSixDependenciesInjector(), (injector) => injector.resolve("parent"));
}

export function *coldResolveTransientFactoryWithSixDependencies(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryWithSixDependenciesInjector, (injector) => injector.resolve("parent"));
}
