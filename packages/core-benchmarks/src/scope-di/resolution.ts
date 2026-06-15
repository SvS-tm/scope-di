// deno-lint-ignore-file no-sloppy-imports
import { configureRootScope, DependencyLifetime } from "@svs-tm/scope-di";
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

function createValueScope()
{
    return configureRootScope()
        .map("value").asValue({})
        .build();
}

export function *warmResolveValue(_: k_state)
{
    yield *createWarmResolutionBenchmark(createValueScope(), (scope) => scope.resolve("value"));
}

export function *coldResolveValue(_: k_state)
{
    yield *createColdResolutionBenchmark(createValueScope, (scope) => scope.resolve("value"));
}

function createSingletonClassScope()
{
    return configureRootScope()
        .map("singleton").asClass(Leaf, DependencyLifetime.Singleton)
        .build();
}

export function *warmResolveSingletonClass(_: k_state)
{
    yield *createWarmResolutionBenchmark(createSingletonClassScope(), (scope) => scope.resolve("singleton"));
}

export function *coldResolveSingletonClass(_: k_state)
{
    yield *createColdResolutionBenchmark(createSingletonClassScope, (scope) => scope.resolve("singleton"));
}

function createTransientClassScope()
{
    return configureRootScope()
        .map("transient").asClass(Leaf, DependencyLifetime.Transient)
        .build();
}

export function *warmResolveTransientClass(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientClassScope(), (scope) => scope.resolve("transient"));
}

export function *coldResolveTransientClass(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientClassScope, (scope) => scope.resolve("transient"));
}

function createSingletonFactoryScope()
{
    const value = {};

    return configureRootScope()
        .map("singleton").asFactory(() => value, DependencyLifetime.Singleton)
        .build();
}

export function *warmResolveSingletonFactory(_: k_state)
{
    yield *createWarmResolutionBenchmark(createSingletonFactoryScope(), (scope) => scope.resolve("singleton"));
}

export function *coldResolveSingletonFactory(_: k_state)
{
    yield *createColdResolutionBenchmark(createSingletonFactoryScope, (scope) => scope.resolve("singleton"));
}

function createTransientFactoryScope()
{
    return configureRootScope()
        .map("transient").asFactory(() => ({}), DependencyLifetime.Transient)
        .build();
}

export function *warmResolveTransientFactory(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryScope(), (scope) => scope.resolve("transient"));
}

export function *coldResolveTransientFactory(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryScope, (scope) => scope.resolve("transient"));
}

function createTransientFactoryChainScope()
{
    return configureRootScope()
        .map("leaf").asFactory(() => new Leaf(), DependencyLifetime.Transient)
        .map("middle").asDependent("leaf")
        .factory((leaf) => new Middle(leaf), DependencyLifetime.Transient)
        .map("root").asDependent("middle")
        .factory((middle) => new Root(middle), DependencyLifetime.Transient)
        .build();
}

export function *warmResolveTransientFactoryChain(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryChainScope(), (scope) => scope.resolve("root"));
}

export function *coldResolveTransientFactoryChain(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryChainScope, (scope) => scope.resolve("root"));
}

function createTransientFactoryWithFiveDependenciesScope()
{
    return configureRootScope()
        .map("a").asClass(Dependency, DependencyLifetime.Transient)
        .map("b").asClass(Dependency, DependencyLifetime.Transient)
        .map("c").asClass(Dependency, DependencyLifetime.Transient)
        .map("d").asClass(Dependency, DependencyLifetime.Transient)
        .map("e").asClass(Dependency, DependencyLifetime.Transient)
        .map("parent").asDependent("a", "b", "c", "d", "e")
        .factory((a, b, c, d, e) => ({ a, b, c, d, e }), DependencyLifetime.Transient)
        .build();
}

export function *warmResolveTransientFactoryWithFiveDependencies(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryWithFiveDependenciesScope(), (scope) => scope.resolve("parent"));
}

export function *coldResolveTransientFactoryWithFiveDependencies(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryWithFiveDependenciesScope, (scope) => scope.resolve("parent"));
}

function createTransientFactoryWithSixDependenciesScope()
{
    return configureRootScope()
        .map("a").asClass(Dependency, DependencyLifetime.Transient)
        .map("b").asClass(Dependency, DependencyLifetime.Transient)
        .map("c").asClass(Dependency, DependencyLifetime.Transient)
        .map("d").asClass(Dependency, DependencyLifetime.Transient)
        .map("e").asClass(Dependency, DependencyLifetime.Transient)
        .map("f").asClass(Dependency, DependencyLifetime.Transient)
        .map("parent").asDependent("a", "b", "c", "d", "e", "f")
        .factory((a, b, c, d, e, f) => ({ a, b, c, d, e, f }), DependencyLifetime.Transient)
        .build();
}

export function *warmResolveTransientFactoryWithSixDependencies(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryWithSixDependenciesScope(), (scope) => scope.resolve("parent"));
}

export function *coldResolveTransientFactoryWithSixDependencies(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryWithSixDependenciesScope, (scope) => scope.resolve("parent"));
}
