import { TrackedPromise } from "@svs-tm/system";
import { DependencyDescriptor, DependencyDescriptorType, DependencyLifetime, RegisteredDependencies } from "../../../types";
import { DependencyDescriptorsBucket } from "../../../types/internals/dependency-descriptors-bucket";
import { DefaultDiScope } from "../../scope/default-di-scope";
import { createDefaultDiScope } from "../../scope/default-di-scope.test-helpers";

export class AsyncArgumentList
{
    public readonly values: unknown[];

    public constructor(...values: unknown[])
    {
        this.values = values;
    }
}

export function collectAsyncArguments(...values: unknown[])
{
    return Promise.resolve(new AsyncArgumentList(...values));
}

export function assertTrackedPromise<T_Result>(promise: Promise<T_Result>): asserts promise is TrackedPromise<T_Result>
{
    if (!TrackedPromise.isTracked(promise))
        throw new Error("Expected a tracked promise");
}

export function createAsyncStrategyScope
(
    values: unknown[],
    asyncValues = new Map<number, Promise<unknown>>(),
    keys = values.map((_value, index) => `dependency${index}`)
)
{
    const descriptors = new Map<string, DependencyDescriptorsBucket>();

    for (let index = 0; index < values.length; ++index)
    {
        const key = keys[index];
        const asyncValue = asyncValues.get(index);
        const descriptor: DependencyDescriptor = asyncValue === undefined
            ? {
                key,
                type: DependencyDescriptorType.Value,
                lifetime: DependencyLifetime.Singleton,
                value: values[index]
            }
            : {
                key,
                type: DependencyDescriptorType.FactoryAsync,
                lifetime: DependencyLifetime.Singleton,
                factory: () => asyncValue
            };

        descriptors.set(key, descriptor);
    }

    return { scope: createDefaultDiScope<RegisteredDependencies>(descriptors), keys };
}

export function createAsyncStrategyChildScope(parent: DefaultDiScope<RegisteredDependencies>)
{
    const child = parent.createChildScope();

    if (!(child instanceof DefaultDiScope))
        throw new Error("Expected a DefaultDiScope child.");

    return child;
}
