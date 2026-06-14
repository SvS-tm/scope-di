// deno-lint-ignore-file no-sloppy-imports
import { configureRootScope, DependencyLifetime, type DependencyDescriptor } from "@svs-tm/scope-di";
import { do_not_optimize, type k_state } from "mitata";

class DisposableDependency implements Disposable
{
    public [Symbol.dispose]()
    {
    }
}

class Dependency
{
}

function getSingleDescriptor(descriptorOrCollection: DependencyDescriptor | readonly DependencyDescriptor[])
{
    if (Array.isArray(descriptorOrCollection))
        throw new Error("Expected a single descriptor.");

    return descriptorOrCollection as DependencyDescriptor;
}

export function *registryResolveSingleDescriptor(_: k_state)
{
    const scope = configureRootScope()
        .map("value").asValue({})
        .build();

    yield () => do_not_optimize(scope.registry.resolveDescriptorsByKey("value"));
}

export function *registryResolveCollectionDescriptors(_: k_state)
{
    const scope = configureRootScope()
        .map("item").asValue(1)
        .map("item").asValue(2)
        .map("item").asValue(3)
        .build();

    yield () => do_not_optimize(scope.registry.resolveDescriptorsByKey(["item"]));
}

export function *findResolvedSingletonMiss(_: k_state)
{
    const scope = configureRootScope()
        .map("singleton").asClass(class {}, DependencyLifetime.Singleton)
        .build();
    const descriptor = getSingleDescriptor(scope.registry.resolveDescriptorsByKey("singleton"));

    yield () => do_not_optimize(scope.findResolvedDependencyByDescriptor(descriptor));
}

export function *findResolvedSingletonHit(_: k_state)
{
    const scope = configureRootScope()
        .map("singleton").asClass(class {}, DependencyLifetime.Singleton)
        .build();
    const descriptor = getSingleDescriptor(scope.registry.resolveDescriptorsByKey("singleton"));

    scope.resolve("singleton");

    yield () => do_not_optimize(scope.findResolvedDependencyByDescriptor(descriptor));
}

export function *findResolvedTransient(_: k_state)
{
    const scope = configureRootScope()
        .map("transient").asClass(class {}, DependencyLifetime.Transient)
        .build();
    const descriptor = getSingleDescriptor(scope.registry.resolveDescriptorsByKey("transient"));

    scope.resolve("transient");

    yield () => do_not_optimize(scope.findResolvedDependencyByDescriptor(descriptor));
}

export function *resolveNoKeys(_: k_state)
{
    const scope = configureRootScope().build();

    yield () => do_not_optimize(scope.resolveRange());
}

export function *resolveCachedValue(_: k_state)
{
    const scope = configureRootScope()
        .map("value").asValue({})
        .build();

    yield () => do_not_optimize(scope.resolve("value"));
}

export function *resolveCachedThreeValues(_: k_state)
{
    const scope = configureRootScope()
        .map("a").asValue({})
        .map("b").asValue({})
        .map("c").asValue({})
        .build();

    yield () => do_not_optimize(scope.resolveRange("a", "b", "c"));
}

export function *resolveCachedFiveValues(_: k_state)
{
    const scope = configureRootScope()
        .map("a").asValue({})
        .map("b").asValue({})
        .map("c").asValue({})
        .map("d").asValue({})
        .map("e").asValue({})
        .build();

    yield () => do_not_optimize(scope.resolveRange("a", "b", "c", "d", "e"));
}

export function *resolveCachedSixValues(_: k_state)
{
    const scope = configureRootScope()
        .map("a").asValue({})
        .map("b").asValue({})
        .map("c").asValue({})
        .map("d").asValue({})
        .map("e").asValue({})
        .map("f").asValue({})
        .build();

    yield () => do_not_optimize(scope.resolveRange("a", "b", "c", "d", "e", "f"));
}

export function *resolveCollectionValues(_: k_state)
{
    const scope = configureRootScope()
        .map("item").asValue(1)
        .map("item").asValue(2)
        .map("item").asValue(3)
        .build();

    yield () => do_not_optimize(scope.resolve(["item"] as never));
}

export function *resolveTransientFactoryWithFiveDependencies(_: k_state)
{
    const scope = configureRootScope()
        .map("a").asClass(Dependency, DependencyLifetime.Transient)
        .map("b").asClass(Dependency, DependencyLifetime.Transient)
        .map("c").asClass(Dependency, DependencyLifetime.Transient)
        .map("d").asClass(Dependency, DependencyLifetime.Transient)
        .map("e").asClass(Dependency, DependencyLifetime.Transient)
        .map("parent").asDependent("a", "b", "c", "d", "e")
        .factory((a, b, c, d, e) => ({ a, b, c, d, e }), DependencyLifetime.Transient)
        .build();

    yield () => do_not_optimize(scope.resolve("parent"));
}

export function *resolveTransientFactoryWithSixDependencies(_: k_state)
{
    const scope = configureRootScope()
        .map("a").asClass(Dependency, DependencyLifetime.Transient)
        .map("b").asClass(Dependency, DependencyLifetime.Transient)
        .map("c").asClass(Dependency, DependencyLifetime.Transient)
        .map("d").asClass(Dependency, DependencyLifetime.Transient)
        .map("e").asClass(Dependency, DependencyLifetime.Transient)
        .map("f").asClass(Dependency, DependencyLifetime.Transient)
        .map("parent").asDependent("a", "b", "c", "d", "e", "f")
        .factory((a, b, c, d, e, f) => ({ a, b, c, d, e, f }), DependencyLifetime.Transient)
        .build();

    yield () => do_not_optimize(scope.resolve("parent"));
}

export function *createChildScope(_: k_state)
{
    const scope = configureRootScope()
        .map("value").asValue({})
        .build();

    yield () => do_not_optimize(scope.createChildScope());
}

export function *disposeEmptyScope(_: k_state)
{
    yield () =>
    {
        const scope = configureRootScope().build();

        do_not_optimize(scope[Symbol.dispose]());
    };
}

export function *disposeResolvedSingleton(_: k_state)
{
    yield () =>
    {
        const scope = configureRootScope()
            .map("dependency").asClass(DisposableDependency, DependencyLifetime.Singleton)
            .build();

        scope.resolve("dependency");

        do_not_optimize(scope[Symbol.dispose]());
    };
}
