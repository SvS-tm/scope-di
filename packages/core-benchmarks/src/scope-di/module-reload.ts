import type { k_state } from "mitata";
import { createWarmResolutionBenchmark } from "../helpers.ts";
import { createTransientFactoryWithChangingShapeBuilder, createTransientFactoryDeepChainBuilder, createTransientFactoryWithFiveDependenciesBuilder, createTransientFactoryWithSixDependenciesBuilder, createTransientFactoryWithTenDependenciesBuilder } from "./resolution.ts";

export async function *warmResolveTransientFactoryDeepChain(state: k_state)
{
    const scope = await createTransientFactoryDeepChainBuilder(state.get("codeGeneration") === true).setAllowRuntimeModuleIsolation().buildAsync();
    yield *createWarmResolutionBenchmark(scope, current => current.resolve("root"));
}

export async function *warmResolveTransientFactoryWithFiveDependencies(state: k_state)
{
    const scope = await createTransientFactoryWithFiveDependenciesBuilder(state.get("codeGeneration") === true).setAllowRuntimeModuleIsolation().buildAsync();
    yield *createWarmResolutionBenchmark(scope, current => current.resolve("parent"));
}

export async function *warmResolveTransientFactoryWithSixDependencies(state: k_state)
{
    const scope = await createTransientFactoryWithSixDependenciesBuilder(state.get("codeGeneration") === true).setAllowRuntimeModuleIsolation().buildAsync();
    yield *createWarmResolutionBenchmark(scope, current => current.resolve("parent"));
}

export async function *warmResolveTransientFactoryWithTenDependencies(state: k_state)
{
    const scope = await createTransientFactoryWithTenDependenciesBuilder(state.get("codeGeneration") === true).setAllowRuntimeModuleIsolation().buildAsync();
    yield *createWarmResolutionBenchmark(scope, current => current.resolve("parent"));
}

export async function *warmResolveTransientFactoryWithChangingShape(state: k_state)
{
    const scope = await createTransientFactoryWithChangingShapeBuilder(state.get("codeGeneration") === true).setAllowRuntimeModuleIsolation().buildAsync();
    yield *createWarmResolutionBenchmark(scope, current => current.resolve("transient"));
}
