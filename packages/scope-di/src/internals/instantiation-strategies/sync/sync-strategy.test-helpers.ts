import { DependencyDescriptorType, DependencyLifetime, RegisteredDependencies } from "../../../types";
import { DependencyDescriptorsBucket } from "../../../types/internals/dependency-descriptors-bucket";
import { createDefaultDiScope } from "../../scope/default-di-scope.test-helpers";
import { DefaultDiScope } from "../../scope/default-di-scope";

export function createSyncStrategyChildScope(parent: DefaultDiScope<RegisteredDependencies>)
{
    const child = parent.createChildScope();

    if (!(child instanceof DefaultDiScope))
        throw new Error("Expected a DefaultDiScope child.");

    return child;
}

export function createSyncStrategyScope()
{
    return createDefaultDiScope<RegisteredDependencies>
    (
        new Map<string, DependencyDescriptorsBucket>()
            .set("dependency", { key: "dependency", type: DependencyDescriptorType.Factory, lifetime: DependencyLifetime.Scoped, factory: () => ({}) })
            .set("transient", { key: "transient", type: DependencyDescriptorType.Factory, lifetime: DependencyLifetime.Transient, factory: () => ({}) })
    );
}

export function createSyncValueStrategyScope(values: ReadonlyMap<string, unknown>)
{
    const descriptors = new Map<string, DependencyDescriptorsBucket>();

    for (const [key, value] of values)
    {
        descriptors.set
        (
            key,
            Array.isArray(value)
                ? value.map(item => ({ key, type: DependencyDescriptorType.Value, lifetime: DependencyLifetime.Singleton, value: item }))
                : { key, type: DependencyDescriptorType.Value, lifetime: DependencyLifetime.Singleton, value }
        );
    }

    return createDefaultDiScope<RegisteredDependencies>(descriptors);
}
