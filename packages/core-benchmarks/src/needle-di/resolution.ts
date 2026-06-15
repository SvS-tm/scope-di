// deno-lint-ignore-file no-sloppy-imports
import { Container } from "@needle-di/core";
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

class ValueToken {}
class SingletonToken {}
class TransientToken {}
class SingletonFactoryToken {}
class TransientFactoryToken {}

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

function createTransientClassContainer()
{
    const container = new Container();
    container.bind({ provide: TransientToken, useFactory: () => new Leaf() });

    return container;
}

export function *warmResolveTransientClass(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientClassContainer(), (container) => container.get(TransientToken));
}

export function *coldResolveTransientClass(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientClassContainer, (container) => container.get(TransientToken));
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

function createTransientFactoryContainer()
{
    const container = new Container();
    container.bind({ provide: TransientFactoryToken, useFactory: () => ({}) });

    return container;
}

export function *warmResolveTransientFactory(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryContainer(), (container) => container.get(TransientFactoryToken));
}

export function *coldResolveTransientFactory(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryContainer, (container) => container.get(TransientFactoryToken));
}

function createTransientFactoryChainContainer()
{
    const container = new Container();
    container.bind({ provide: Leaf, useFactory: () => new Leaf() });
    container.bind({ provide: Middle, useFactory: (container) => new Middle(container.get(Leaf)) });
    container.bind({ provide: Root, useFactory: (container) => new Root(container.get(Middle)) });

    return container;
}

export function *warmResolveTransientFactoryChain(_: k_state)
{
    yield *createWarmResolutionBenchmark(createTransientFactoryChainContainer(), (container) => container.get(Root));
}

export function *coldResolveTransientFactoryChain(_: k_state)
{
    yield *createColdResolutionBenchmark(createTransientFactoryChainContainer, (container) => container.get(Root));
}
