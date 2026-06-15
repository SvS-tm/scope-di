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

function createTransientFactoryDeepChainScope()
{
    return configureRootScope()
        .map("leaf").asClass(Dependency, DependencyLifetime.Transient)
        .map("level1").asDependent("leaf")
        .factory((leaf) => ({ leaf }), DependencyLifetime.Transient)
        .map("level2").asDependent("level1")
        .factory((level1) => ({ level1 }), DependencyLifetime.Transient)
        .map("level3").asDependent("level2")
        .factory((level2) => ({ level2 }), DependencyLifetime.Transient)
        .map("level4").asDependent("level3")
        .factory((level3) => ({ level3 }), DependencyLifetime.Transient)
        .map("root").asDependent("level4")
        .factory((level4) => ({ level4 }), DependencyLifetime.Transient)
        .build();
}

export function *warmResolveTransientFactoryDeepChain(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryDeepChainScope(), (scope) => scope.resolve("root"));
}

export function *coldResolveTransientFactoryDeepChain(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryDeepChainScope, (scope) => scope.resolve("root"));
}

function createTransientFactoryWithTenDependenciesScope()
{
    return configureRootScope()
        .map("a").asClass(Dependency, DependencyLifetime.Transient)
        .map("b").asClass(Dependency, DependencyLifetime.Transient)
        .map("c").asClass(Dependency, DependencyLifetime.Transient)
        .map("d").asClass(Dependency, DependencyLifetime.Transient)
        .map("e").asClass(Dependency, DependencyLifetime.Transient)
        .map("f").asClass(Dependency, DependencyLifetime.Transient)
        .map("g").asClass(Dependency, DependencyLifetime.Transient)
        .map("h").asClass(Dependency, DependencyLifetime.Transient)
        .map("i").asClass(Dependency, DependencyLifetime.Transient)
        .map("j").asClass(Dependency, DependencyLifetime.Transient)
        .map("parent").asDependent("a", "b", "c", "d", "e", "f", "g", "h", "i", "j")
        .factory((a, b, c, d, e, f, g, h, i, j) => ({ a, b, c, d, e, f, g, h, i, j }), DependencyLifetime.Transient)
        .build();
}

export function *warmResolveTransientFactoryWithTenDependencies(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryWithTenDependenciesScope(), (scope) => scope.resolve("parent"));
}

export function *coldResolveTransientFactoryWithTenDependencies(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryWithTenDependenciesScope, (scope) => scope.resolve("parent"));
}

function createTransientFactoryDeepWideGraphScope()
{
    return configureRootScope()
        .map("a1").asClass(Dependency, DependencyLifetime.Transient)
        .map("a2").asClass(Dependency, DependencyLifetime.Transient)
        .map("a3").asClass(Dependency, DependencyLifetime.Transient)
        .map("a4").asClass(Dependency, DependencyLifetime.Transient)
        .map("a5").asClass(Dependency, DependencyLifetime.Transient)
        .map("b1").asClass(Dependency, DependencyLifetime.Transient)
        .map("b2").asClass(Dependency, DependencyLifetime.Transient)
        .map("b3").asClass(Dependency, DependencyLifetime.Transient)
        .map("b4").asClass(Dependency, DependencyLifetime.Transient)
        .map("b5").asClass(Dependency, DependencyLifetime.Transient)
        .map("c1").asClass(Dependency, DependencyLifetime.Transient)
        .map("c2").asClass(Dependency, DependencyLifetime.Transient)
        .map("c3").asClass(Dependency, DependencyLifetime.Transient)
        .map("c4").asClass(Dependency, DependencyLifetime.Transient)
        .map("c5").asClass(Dependency, DependencyLifetime.Transient)
        .map("d1").asClass(Dependency, DependencyLifetime.Transient)
        .map("d2").asClass(Dependency, DependencyLifetime.Transient)
        .map("d3").asClass(Dependency, DependencyLifetime.Transient)
        .map("d4").asClass(Dependency, DependencyLifetime.Transient)
        .map("d5").asClass(Dependency, DependencyLifetime.Transient)
        .map("e1").asClass(Dependency, DependencyLifetime.Transient)
        .map("e2").asClass(Dependency, DependencyLifetime.Transient)
        .map("e3").asClass(Dependency, DependencyLifetime.Transient)
        .map("e4").asClass(Dependency, DependencyLifetime.Transient)
        .map("e5").asClass(Dependency, DependencyLifetime.Transient)
        .map("a").asDependent("a1", "a2", "a3", "a4", "a5")
        .factory((a1, a2, a3, a4, a5) => ({ a1, a2, a3, a4, a5 }), DependencyLifetime.Transient)
        .map("b").asDependent("b1", "b2", "b3", "b4", "b5")
        .factory((b1, b2, b3, b4, b5) => ({ b1, b2, b3, b4, b5 }), DependencyLifetime.Transient)
        .map("c").asDependent("c1", "c2", "c3", "c4", "c5")
        .factory((c1, c2, c3, c4, c5) => ({ c1, c2, c3, c4, c5 }), DependencyLifetime.Transient)
        .map("d").asDependent("d1", "d2", "d3", "d4", "d5")
        .factory((d1, d2, d3, d4, d5) => ({ d1, d2, d3, d4, d5 }), DependencyLifetime.Transient)
        .map("e").asDependent("e1", "e2", "e3", "e4", "e5")
        .factory((e1, e2, e3, e4, e5) => ({ e1, e2, e3, e4, e5 }), DependencyLifetime.Transient)
        .map("root").asDependent("a", "b", "c", "d", "e")
        .factory((a, b, c, d, e) => ({ a, b, c, d, e }), DependencyLifetime.Transient)
        .build();
}

export function *warmResolveTransientFactoryDeepWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryDeepWideGraphScope(), (scope) => scope.resolve("root"));
}

export function *coldResolveTransientFactoryDeepWideGraph(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryDeepWideGraphScope, (scope) => scope.resolve("root"));
}

function createCachedFactoryWideGraphScope()
{
    return configureRootScope()
        .map("a").asClass(Dependency, DependencyLifetime.Singleton)
        .map("b").asClass(Dependency, DependencyLifetime.Singleton)
        .map("c").asClass(Dependency, DependencyLifetime.Singleton)
        .map("d").asClass(Dependency, DependencyLifetime.Singleton)
        .map("e").asClass(Dependency, DependencyLifetime.Singleton)
        .map("f").asClass(Dependency, DependencyLifetime.Singleton)
        .map("g").asClass(Dependency, DependencyLifetime.Singleton)
        .map("h").asClass(Dependency, DependencyLifetime.Singleton)
        .map("i").asClass(Dependency, DependencyLifetime.Singleton)
        .map("j").asClass(Dependency, DependencyLifetime.Singleton)
        .map("root").asDependent("a", "b", "c", "d", "e", "f", "g", "h", "i", "j")
        .factory((a, b, c, d, e, f, g, h, i, j) => ({ a, b, c, d, e, f, g, h, i, j }), DependencyLifetime.Transient)
        .build();
}

export function *warmResolveCachedFactoryWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createCachedFactoryWideGraphScope(), (scope) => scope.resolve("root"));
}

function createCachedFactoryDeepWideGraphScope()
{
    return configureRootScope()
        .map("a1").asClass(Dependency, DependencyLifetime.Singleton)
        .map("a2").asClass(Dependency, DependencyLifetime.Singleton)
        .map("a3").asClass(Dependency, DependencyLifetime.Singleton)
        .map("a4").asClass(Dependency, DependencyLifetime.Singleton)
        .map("a5").asClass(Dependency, DependencyLifetime.Singleton)
        .map("b1").asClass(Dependency, DependencyLifetime.Singleton)
        .map("b2").asClass(Dependency, DependencyLifetime.Singleton)
        .map("b3").asClass(Dependency, DependencyLifetime.Singleton)
        .map("b4").asClass(Dependency, DependencyLifetime.Singleton)
        .map("b5").asClass(Dependency, DependencyLifetime.Singleton)
        .map("c1").asClass(Dependency, DependencyLifetime.Singleton)
        .map("c2").asClass(Dependency, DependencyLifetime.Singleton)
        .map("c3").asClass(Dependency, DependencyLifetime.Singleton)
        .map("c4").asClass(Dependency, DependencyLifetime.Singleton)
        .map("c5").asClass(Dependency, DependencyLifetime.Singleton)
        .map("d1").asClass(Dependency, DependencyLifetime.Singleton)
        .map("d2").asClass(Dependency, DependencyLifetime.Singleton)
        .map("d3").asClass(Dependency, DependencyLifetime.Singleton)
        .map("d4").asClass(Dependency, DependencyLifetime.Singleton)
        .map("d5").asClass(Dependency, DependencyLifetime.Singleton)
        .map("e1").asClass(Dependency, DependencyLifetime.Singleton)
        .map("e2").asClass(Dependency, DependencyLifetime.Singleton)
        .map("e3").asClass(Dependency, DependencyLifetime.Singleton)
        .map("e4").asClass(Dependency, DependencyLifetime.Singleton)
        .map("e5").asClass(Dependency, DependencyLifetime.Singleton)
        .map("a").asDependent("a1", "a2", "a3", "a4", "a5")
        .factory((a1, a2, a3, a4, a5) => ({ a1, a2, a3, a4, a5 }), DependencyLifetime.Transient)
        .map("b").asDependent("b1", "b2", "b3", "b4", "b5")
        .factory((b1, b2, b3, b4, b5) => ({ b1, b2, b3, b4, b5 }), DependencyLifetime.Transient)
        .map("c").asDependent("c1", "c2", "c3", "c4", "c5")
        .factory((c1, c2, c3, c4, c5) => ({ c1, c2, c3, c4, c5 }), DependencyLifetime.Transient)
        .map("d").asDependent("d1", "d2", "d3", "d4", "d5")
        .factory((d1, d2, d3, d4, d5) => ({ d1, d2, d3, d4, d5 }), DependencyLifetime.Transient)
        .map("e").asDependent("e1", "e2", "e3", "e4", "e5")
        .factory((e1, e2, e3, e4, e5) => ({ e1, e2, e3, e4, e5 }), DependencyLifetime.Transient)
        .map("root").asDependent("a", "b", "c", "d", "e")
        .factory((a, b, c, d, e) => ({ a, b, c, d, e }), DependencyLifetime.Transient)
        .build();
}

export function *warmResolveCachedFactoryDeepWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createCachedFactoryDeepWideGraphScope(), (scope) => scope.resolve("root"));
}
