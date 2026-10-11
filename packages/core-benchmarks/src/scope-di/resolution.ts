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

function createValueScope(allowRuntimeCodeGeneration = false)
{
    return configureRootScope()
        .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration)
        .map("value").asValue({})
        .build();
}

export function *warmResolveValue(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createValueScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("value"));
}

export function *coldResolveValue(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createValueScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("value"));
}

function createSingletonClassScope(allowRuntimeCodeGeneration = false)
{
    return configureRootScope()
        .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration)
        .map("singleton").asClass(Leaf, DependencyLifetime.Singleton)
        .build();
}

export function *warmResolveSingletonClass(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createSingletonClassScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("singleton"));
}

export function *coldResolveSingletonClass(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createSingletonClassScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("singleton"));
}

function createTransientClassScope(allowRuntimeCodeGeneration = false)
{
    return configureRootScope()
        .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration)
        .map("transient").asClass(Leaf, DependencyLifetime.Transient)
        .build();
}

export function *warmResolveTransientClass(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientClassScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("transient"));
}

export function *coldResolveTransientClass(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientClassScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("transient"));
}

function createSingletonFactoryScope(allowRuntimeCodeGeneration = false)
{
    const value = {};

    return configureRootScope()
        .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration)
        .map("singleton").asFactory(() => value, DependencyLifetime.Singleton)
        .build();
}

export function *warmResolveSingletonFactory(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createSingletonFactoryScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("singleton"));
}

export function *coldResolveSingletonFactory(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createSingletonFactoryScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("singleton"));
}

function createTransientFactoryScope(allowRuntimeCodeGeneration = false)
{
    return configureRootScope()
        .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration)
        .map("transient").asFactory(() => ({}), DependencyLifetime.Transient)
        .build();
}

export function *warmResolveTransientFactory(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("transient"));
}

export function *coldResolveTransientFactory(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("transient"));
}

function createTransientFactoryChainScope(allowRuntimeCodeGeneration = false)
{
    return configureRootScope()
        .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration)
        .map("leaf").asFactory(() => new Leaf(), DependencyLifetime.Transient)
        .map("middle").asDependent("leaf")
        .factory((leaf) => new Middle(leaf), DependencyLifetime.Transient)
        .map("root").asDependent("middle")
        .factory((middle) => new Root(middle), DependencyLifetime.Transient)
        .build();
}

export function *warmResolveTransientFactoryChain(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryChainScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("root"));
}

export function *coldResolveTransientFactoryChain(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryChainScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("root"));
}

function createTransientFactoryWithFiveDependenciesScope(allowRuntimeCodeGeneration = false)
{
    return configureRootScope()
        .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration)
        .map("a").asClass(Dependency, DependencyLifetime.Transient)
        .map("b").asClass(Dependency, DependencyLifetime.Transient)
        .map("c").asClass(Dependency, DependencyLifetime.Transient)
        .map("d").asClass(Dependency, DependencyLifetime.Transient)
        .map("e").asClass(Dependency, DependencyLifetime.Transient)
        .map("parent").asDependent("a", "b", "c", "d", "e")
        .factory((a, b, c, d, e) => ({ a, b, c, d, e }), DependencyLifetime.Transient)
        .build();
}

export function *warmResolveTransientFactoryWithFiveDependencies(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryWithFiveDependenciesScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("parent"));
}

export function *coldResolveTransientFactoryWithFiveDependencies(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryWithFiveDependenciesScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("parent"));
}

function createTransientFactoryWithSixDependenciesScope(allowRuntimeCodeGeneration = false)
{
    return configureRootScope()
        .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration)
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

export function *warmResolveTransientFactoryWithSixDependencies(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryWithSixDependenciesScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("parent"));
}

export function *coldResolveTransientFactoryWithSixDependencies(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryWithSixDependenciesScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("parent"));
}

function createTransientFactoryDeepChainScope(allowRuntimeCodeGeneration = false)
{
    return configureRootScope()
        .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration)
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

export function *warmResolveTransientFactoryDeepChain(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryDeepChainScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("root"));
}

export function *coldResolveTransientFactoryDeepChain(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryDeepChainScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("root"));
}

function createTransientFactoryWithTenDependenciesScope(allowRuntimeCodeGeneration = false)
{
    return configureRootScope()
        .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration)
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

export function *warmResolveTransientFactoryWithTenDependencies(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryWithTenDependenciesScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("parent"));
}

export function *coldResolveTransientFactoryWithTenDependencies(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryWithTenDependenciesScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("parent"));
}

function createTransientFactoryDeepWideGraphScope(allowRuntimeCodeGeneration = false)
{
    return configureRootScope()
        .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration)
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

export function *warmResolveTransientFactoryDeepWideGraph(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createTransientFactoryDeepWideGraphScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("root"));
}

export function *coldResolveTransientFactoryDeepWideGraph(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createColdResolutionBenchmark(() => createTransientFactoryDeepWideGraphScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("root"));
}

function createCachedFactoryWideGraphScope(allowRuntimeCodeGeneration = false)
{
    return configureRootScope()
        .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration)
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

export function *warmResolveCachedFactoryWideGraph(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createCachedFactoryWideGraphScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("root"));
}

function createCachedFactoryDeepWideGraphScope(allowRuntimeCodeGeneration = false)
{
    return configureRootScope()
        .setAllowRuntimeCodeGeneration(allowRuntimeCodeGeneration)
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

export function *warmResolveCachedFactoryDeepWideGraph(state: k_state)
{
    const allowRuntimeCodeGeneration = state.get("codeGeneration") === true;

    yield *createWarmResolutionBenchmark(createCachedFactoryDeepWideGraphScope(allowRuntimeCodeGeneration), (scope) => scope.resolve("root"));
}
