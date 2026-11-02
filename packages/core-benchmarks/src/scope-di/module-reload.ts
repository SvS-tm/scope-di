import type { k_state } from "mitata";
import { createWarmResolutionBenchmark } from "../helpers.ts";
import * as resolution from "./resolution.ts";

export async function *warmResolveValue(state: k_state)
{
    const scope = await resolution.createValueBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("value"));
}

export async function *warmResolveSingletonClass(state: k_state)
{
    const scope = await resolution.createSingletonClassBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("singleton"));
}

export async function *warmResolveTransientClass(state: k_state)
{
    const scope = await resolution.createTransientClassBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("transient"));
}

export async function *warmResolveSingletonFactory(state: k_state)
{
    const scope = await resolution.createSingletonFactoryBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("singleton"));
}

export async function *warmResolveTransientFactory(state: k_state)
{
    const scope = await resolution.createTransientFactoryBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("transient"));
}

export async function *warmResolveTransientFactoryChain(state: k_state)
{
    const scope = await resolution.createTransientFactoryChainBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("root"));
}

export async function *warmResolveTransientFactoryWithFiveDependencies(state: k_state)
{
    const scope = await resolution.createTransientFactoryWithFiveDependenciesBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("parent"));
}

export async function *warmResolveTransientFactoryWithSixDependencies(state: k_state)
{
    const scope = await resolution.createTransientFactoryWithSixDependenciesBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("parent"));
}

export async function *warmResolveTransientFactoryDeepChain(state: k_state)
{
    const scope = await resolution.createTransientFactoryDeepChainBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("root"));
}

export async function *warmResolveTransientFactoryWithTenDependencies(state: k_state)
{
    const scope = await resolution.createTransientFactoryWithTenDependenciesBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("parent"));
}

export async function *warmResolveTransientFactoryDeepWideGraph(state: k_state)
{
    const scope = await resolution.createTransientFactoryDeepWideGraphBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("root"));
}

export async function *warmResolveCachedFactoryWideGraph(state: k_state)
{
    const scope = await resolution.createCachedFactoryWideGraphBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("root"));
}

export async function *warmResolveCachedFactoryDeepWideGraph(state: k_state)
{
    const scope = await resolution.createCachedFactoryDeepWideGraphBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("root"));
}

export async function *warmResolveTransientFactoryWithChangingShape(state: k_state)
{
    const scope = await resolution.createTransientFactoryWithChangingShapeBuilder(state.get("codeGeneration") === true)
        .setAllowRuntimeModuleIsolation(true)
        .build();

    yield *createWarmResolutionBenchmark(scope, current => current.resolve("transient"));
}
