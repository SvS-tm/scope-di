// deno-lint-ignore-file no-sloppy-imports
import { Container } from "@needle-di/core";
import type { k_state } from "mitata";
import { createColdResolutionBenchmark, createWarmResolutionBenchmark } from "../helpers.ts";

class Leaf {}

class ValueToken {}
class SingletonToken {}
class SingletonFactoryToken {}

function createValueContainer()
{
    const container = new Container();
    container.bind({ provide: ValueToken, useValue: {} });

    return container;
}

export function *warmResolveValue(_: k_state)
{
    yield *createWarmResolutionBenchmark(createValueContainer(), (container) => container.get(ValueToken));
}

export function *coldResolveValue(_: k_state)
{
    yield *createColdResolutionBenchmark(createValueContainer, (container) => container.get(ValueToken));
}

function createSingletonClassContainer()
{
    const container = new Container();
    container.bind({ provide: SingletonToken, useClass: Leaf });

    return container;
}

export function *warmResolveSingletonClass(_: k_state)
{
    yield *createWarmResolutionBenchmark(createSingletonClassContainer(), (container) => container.get(SingletonToken));
}

export function *coldResolveSingletonClass(_: k_state)
{
    yield *createColdResolutionBenchmark(createSingletonClassContainer, (container) => container.get(SingletonToken));
}

function createSingletonFactoryContainer()
{
    const value = {};
    const container = new Container();
    container.bind({ provide: SingletonFactoryToken, useFactory: () => value });

    return container;
}

export function *warmResolveSingletonFactory(_: k_state)
{
    yield *createWarmResolutionBenchmark(createSingletonFactoryContainer(), (container) => container.get(SingletonFactoryToken));
}

export function *coldResolveSingletonFactory(_: k_state)
{
    yield *createColdResolutionBenchmark(createSingletonFactoryContainer, (container) => container.get(SingletonFactoryToken));
}
