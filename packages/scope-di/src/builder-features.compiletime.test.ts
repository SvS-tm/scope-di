/// <reference path="./types/isolated-transient-strategy-module-path.d.ts" />

import { expect } from "tstyche";
import { configureRootScope, DependencyLifetime, type DiScope } from ".";
import { DefaultDiScopeBuilder } from "./internals/builders/default-di-scope-builder";
import type { FeatureFlag } from "./types/feature-flag";

expect(configureRootScope().build()).type.toBe<DiScope<never>>();
expect(configureRootScope().setAllowRuntimeModuleIsolation(false).build()).type.toBe<DiScope<never>>();
expect(configureRootScope().setAllowRuntimeModuleIsolation(true).build()).type.toBe<Promise<DiScope<never>>>();
expect(configureRootScope().setAllowRuntimeModuleIsolation("auto").build()).type.toBe<Promise<DiScope<never>>>();
expect(new DefaultDiScopeBuilder().setAllowRuntimeModuleIsolation(false).build()).type.toBe<DiScope<never>>();
expect(new DefaultDiScopeBuilder().setAllowRuntimeModuleIsolation(true).build()).type.toBe<Promise<DiScope<never>>>();

declare const unknownFlag: FeatureFlag;
declare const unknownBoolean: boolean;
expect(configureRootScope().setAllowRuntimeModuleIsolation(unknownFlag).build()).type.toBe<DiScope<never> | Promise<DiScope<never>>>();
expect(configureRootScope().setAllowRuntimeModuleIsolation(unknownBoolean).build()).type.toBe<DiScope<never> | Promise<DiScope<never>>>();

expect(configureRootScope().setAllowRuntimeCodeGeneration(true).build()).type.toBe<DiScope<never>>();
expect(configureRootScope().setAllowRuntimeCodeGeneration(false).build()).type.toBe<DiScope<never>>();
expect(configureRootScope().setAllowRuntimeCodeGeneration("auto").build()).type.toBe<DiScope<never>>();
expect(configureRootScope().setAllowRuntimeModuleIsolation(true).setAllowRuntimeCodeGeneration(false).build()).type.toBe<Promise<DiScope<never>>>();
expect(configureRootScope().setAllowRuntimeModuleIsolation(true).setAllowRuntimeModuleIsolation(false).build()).type.toBe<DiScope<never>>();
expect(configureRootScope().setAllowRuntimeModuleIsolation(false).setAllowRuntimeModuleIsolation("auto").build()).type.toBe<Promise<DiScope<never>>>();

class Dependency {}
class Parent
{
    public constructor(public readonly dependency: Dependency) {}
}

const value = configureRootScope().setAllowRuntimeModuleIsolation(true).map("value").asValue(1).build();
const collection = configureRootScope().setAllowRuntimeModuleIsolation(true).map("value").asValue(1).map("value").asValue(2).build();
const classScope = configureRootScope().setAllowRuntimeModuleIsolation(true).map("dependency").asClass(Dependency, DependencyLifetime.Transient).build();
const factory = configureRootScope().setAllowRuntimeModuleIsolation(true).map("dependency").asFactory(() => ({}), DependencyLifetime.Transient).build();
const asyncClass = configureRootScope().setAllowRuntimeModuleIsolation("auto").map("dependency").asClassAsync(Dependency, DependencyLifetime.Transient).build();
const asyncFactory = configureRootScope().setAllowRuntimeModuleIsolation("auto").map("dependency").asFactoryAsync(async () => ({}), DependencyLifetime.Transient).build();

expect(value).type.toBe<Promise<Awaited<typeof value>>>();
expect(collection).type.toBe<Promise<Awaited<typeof collection>>>();
expect(classScope).type.toBe<Promise<Awaited<typeof classScope>>>();
expect(factory).type.toBe<Promise<Awaited<typeof factory>>>();
expect(asyncClass).type.toBe<Promise<Awaited<typeof asyncClass>>>();
expect(asyncFactory).type.toBe<Promise<Awaited<typeof asyncFactory>>>();

const dependentClass = configureRootScope().setAllowRuntimeModuleIsolation(true)
    .map("dependency").asClass(Dependency, DependencyLifetime.Transient)
    .map("parent").asDependent("dependency").class(Parent, DependencyLifetime.Transient).build();
const dependentFactory = configureRootScope().setAllowRuntimeModuleIsolation(true)
    .map("dependency").asValue(1)
    .map("parent").asDependent("dependency").factory((value: 1) => value, DependencyLifetime.Transient).build();
const dependentAsyncClass = configureRootScope().setAllowRuntimeModuleIsolation("auto")
    .map("dependency").asClass(Dependency, DependencyLifetime.Transient)
    .map("parent").asDependent("dependency").classAsync(Parent, DependencyLifetime.Transient).build();
const dependentAsyncFactory = configureRootScope().setAllowRuntimeModuleIsolation("auto")
    .map("dependency").asValue(1)
    .map("parent").asDependent("dependency").factoryAsync(async (value: 1) => value, DependencyLifetime.Transient).build();
const removed = configureRootScope().setAllowRuntimeModuleIsolation(true).map("value").asValue(1).removeMapping("value").build();

expect(dependentClass).type.toBe<Promise<Awaited<typeof dependentClass>>>();
expect(dependentFactory).type.toBe<Promise<Awaited<typeof dependentFactory>>>();
expect(dependentAsyncClass).type.toBe<Promise<Awaited<typeof dependentAsyncClass>>>();
expect(dependentAsyncFactory).type.toBe<Promise<Awaited<typeof dependentAsyncFactory>>>();
expect(removed).type.toBe<Promise<DiScope<never>>>();

// Async build results cannot be used as scopes before awaiting them.
// @ts-expect-error
configureRootScope().setAllowRuntimeModuleIsolation(true).build().resolve("value");
// @ts-expect-error
configureRootScope().setAllowRuntimeModuleIsolation("auto").build().resolve("value");
// @ts-expect-error
configureRootScope().setAllowRuntimeModuleIsolation("invalid");
// @ts-expect-error
configureRootScope().setAllowRuntimeCodeGeneration("invalid");

async function checkResolvedTypes(): Promise<void>
{
    expect((await value).resolve("value")).type.toBe<1>();
    expect((await collection).resolve("value")).type.toBe<2>();
    expect((await collection).resolveRange(["value"])).type.toBe<[[2, 1]]>();
    expect((await dependentFactory).resolve("parent")).type.toBe<1>();
    expect((await dependentAsyncFactory).resolve("parent")).type.toBe<Promise<1>>();
}

void checkResolvedTypes;
