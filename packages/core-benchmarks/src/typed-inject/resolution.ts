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

function createLevel1(leaf: Dependency)
{
    return { leaf };
}
createLevel1.inject = ["leaf"] as const;

function createLevel2(level1: unknown)
{
    return { level1 };
}
createLevel2.inject = ["level1"] as const;

function createLevel3(level2: unknown)
{
    return { level2 };
}
createLevel3.inject = ["level2"] as const;

function createLevel4(level3: unknown)
{
    return { level3 };
}
createLevel4.inject = ["level3"] as const;

function createDeepRoot(level4: unknown)
{
    return { level4 };
}
createDeepRoot.inject = ["level4"] as const;

function createParentWithTenDependencies(a: Dependency, b: Dependency, c: Dependency, d: Dependency, e: Dependency, f: Dependency, g: Dependency, h: Dependency, i: Dependency, j: Dependency)
{
    return { a, b, c, d, e, f, g, h, i, j };
}
createParentWithTenDependencies.inject = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"] as const;

function createGroupA(a1: Dependency, a2: Dependency, a3: Dependency, a4: Dependency, a5: Dependency)
{
    return { a1, a2, a3, a4, a5 };
}
createGroupA.inject = ["a1", "a2", "a3", "a4", "a5"] as const;

function createGroupB(b1: Dependency, b2: Dependency, b3: Dependency, b4: Dependency, b5: Dependency)
{
    return { b1, b2, b3, b4, b5 };
}
createGroupB.inject = ["b1", "b2", "b3", "b4", "b5"] as const;

function createGroupC(c1: Dependency, c2: Dependency, c3: Dependency, c4: Dependency, c5: Dependency)
{
    return { c1, c2, c3, c4, c5 };
}
createGroupC.inject = ["c1", "c2", "c3", "c4", "c5"] as const;

function createGroupD(d1: Dependency, d2: Dependency, d3: Dependency, d4: Dependency, d5: Dependency)
{
    return { d1, d2, d3, d4, d5 };
}
createGroupD.inject = ["d1", "d2", "d3", "d4", "d5"] as const;

function createGroupE(e1: Dependency, e2: Dependency, e3: Dependency, e4: Dependency, e5: Dependency)
{
    return { e1, e2, e3, e4, e5 };
}
createGroupE.inject = ["e1", "e2", "e3", "e4", "e5"] as const;

function createDeepWideRoot(a: unknown, b: unknown, c: unknown, d: unknown, e: unknown)
{
    return { a, b, c, d, e };
}
createDeepWideRoot.inject = ["a", "b", "c", "d", "e"] as const;

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
        .provideClass("a", Dependency, Scope.Transient)
        .provideClass("b", Dependency, Scope.Transient)
        .provideClass("c", Dependency, Scope.Transient)
        .provideClass("d", Dependency, Scope.Transient)
        .provideClass("e", Dependency, Scope.Transient)
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
        .provideClass("a", Dependency, Scope.Transient)
        .provideClass("b", Dependency, Scope.Transient)
        .provideClass("c", Dependency, Scope.Transient)
        .provideClass("d", Dependency, Scope.Transient)
        .provideClass("e", Dependency, Scope.Transient)
        .provideClass("f", Dependency, Scope.Transient)
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

function createTransientFactoryDeepChainInjector()
{
    return createInjector()
        .provideClass("leaf", Dependency, Scope.Transient)
        .provideFactory("level1", createLevel1, Scope.Transient)
        .provideFactory("level2", createLevel2, Scope.Transient)
        .provideFactory("level3", createLevel3, Scope.Transient)
        .provideFactory("level4", createLevel4, Scope.Transient)
        .provideFactory("root", createDeepRoot, Scope.Transient);
}

export function *warmResolveTransientFactoryDeepChain(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryDeepChainInjector(), (injector) => injector.resolve("root"));
}

export function *coldResolveTransientFactoryDeepChain(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryDeepChainInjector, (injector) => injector.resolve("root"));
}

function createTransientFactoryWithTenDependenciesInjector()
{
    return createInjector()
        .provideClass("a", Dependency, Scope.Transient)
        .provideClass("b", Dependency, Scope.Transient)
        .provideClass("c", Dependency, Scope.Transient)
        .provideClass("d", Dependency, Scope.Transient)
        .provideClass("e", Dependency, Scope.Transient)
        .provideClass("f", Dependency, Scope.Transient)
        .provideClass("g", Dependency, Scope.Transient)
        .provideClass("h", Dependency, Scope.Transient)
        .provideClass("i", Dependency, Scope.Transient)
        .provideClass("j", Dependency, Scope.Transient)
        .provideFactory("parent", createParentWithTenDependencies, Scope.Transient);
}

export function *warmResolveTransientFactoryWithTenDependencies(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryWithTenDependenciesInjector(), (injector) => injector.resolve("parent"));
}

export function *coldResolveTransientFactoryWithTenDependencies(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryWithTenDependenciesInjector, (injector) => injector.resolve("parent"));
}

function registerDeepWideDependencies(injector: any, scope: Scope)
{
    return injector
        .provideClass("a1", Dependency, scope)
        .provideClass("a2", Dependency, scope)
        .provideClass("a3", Dependency, scope)
        .provideClass("a4", Dependency, scope)
        .provideClass("a5", Dependency, scope)
        .provideClass("b1", Dependency, scope)
        .provideClass("b2", Dependency, scope)
        .provideClass("b3", Dependency, scope)
        .provideClass("b4", Dependency, scope)
        .provideClass("b5", Dependency, scope)
        .provideClass("c1", Dependency, scope)
        .provideClass("c2", Dependency, scope)
        .provideClass("c3", Dependency, scope)
        .provideClass("c4", Dependency, scope)
        .provideClass("c5", Dependency, scope)
        .provideClass("d1", Dependency, scope)
        .provideClass("d2", Dependency, scope)
        .provideClass("d3", Dependency, scope)
        .provideClass("d4", Dependency, scope)
        .provideClass("d5", Dependency, scope)
        .provideClass("e1", Dependency, scope)
        .provideClass("e2", Dependency, scope)
        .provideClass("e3", Dependency, scope)
        .provideClass("e4", Dependency, scope)
        .provideClass("e5", Dependency, scope);
}

function registerDeepWideGraph(injector: any)
{
    return injector
        .provideFactory("a", createGroupA, Scope.Transient)
        .provideFactory("b", createGroupB, Scope.Transient)
        .provideFactory("c", createGroupC, Scope.Transient)
        .provideFactory("d", createGroupD, Scope.Transient)
        .provideFactory("e", createGroupE, Scope.Transient)
        .provideFactory("root", createDeepWideRoot, Scope.Transient);
}

function createTransientFactoryDeepWideGraphInjector()
{
    return registerDeepWideGraph(registerDeepWideDependencies(createInjector(), Scope.Transient));
}

export function *warmResolveTransientFactoryDeepWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryDeepWideGraphInjector(), (injector) => injector.resolve("root"));
}

export function *coldResolveTransientFactoryDeepWideGraph(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryDeepWideGraphInjector, (injector) => injector.resolve("root"));
}

function createCachedFactoryWideGraphInjector()
{
    return createInjector()
        .provideClass("a", Dependency, Scope.Singleton)
        .provideClass("b", Dependency, Scope.Singleton)
        .provideClass("c", Dependency, Scope.Singleton)
        .provideClass("d", Dependency, Scope.Singleton)
        .provideClass("e", Dependency, Scope.Singleton)
        .provideClass("f", Dependency, Scope.Singleton)
        .provideClass("g", Dependency, Scope.Singleton)
        .provideClass("h", Dependency, Scope.Singleton)
        .provideClass("i", Dependency, Scope.Singleton)
        .provideClass("j", Dependency, Scope.Singleton)
        .provideFactory("root", createParentWithTenDependencies, Scope.Transient);
}

export function *warmResolveCachedFactoryWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createCachedFactoryWideGraphInjector(), (injector) => injector.resolve("root"));
}

function createCachedFactoryDeepWideGraphInjector()
{
    return registerDeepWideGraph(registerDeepWideDependencies(createInjector(), Scope.Singleton));
}

export function *warmResolveCachedFactoryDeepWideGraph(_: k_state)
{
    yield *createWarmResolutionBenchmark(createCachedFactoryDeepWideGraphInjector(), (injector) => injector.resolve("root"));
}
