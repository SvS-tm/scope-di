import { DefaultDiScope } from "../../scope/internals/default-di-scope";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import type { DependencyKey } from "../../types/dependency-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { RemoveDependenciesCollection } from "../../types/utilities/remove-dependencies-collection";
import type { DiScopeBuilder } from "../abstractions";
import { DefaultDiMappingBuilder } from "./default-di-mapping-builder";

export class DefaultDiScopeBuilder<T_RegisteredDependencies extends RegisteredDependencies = never> 
    implements DiScopeBuilder<T_RegisteredDependencies>
{
    private readonly registry = new Map<AllowedDependencyKey, DependencyDescriptor[]>();

    public readonly register = (descriptor: DependencyDescriptor) =>
    {
        const descriptors = this.registry.get(descriptor.key) ?? [];

        descriptors.unshift(descriptor);

        this.registry.set(descriptor.key, descriptors);
    };

    public readonly map = <T_DependencyKey extends AllowedDependencyKey>(key: T_DependencyKey) =>
    {
        return new DefaultDiMappingBuilder(this, key);
    };

    public readonly removeMapping = <T_DependencyKey extends DependencyKey<T_RegisteredDependencies>>
    (
        key: T_DependencyKey
    ) => 
    {
        this.registry.delete(key);

        return this as DiScopeBuilder<RemoveDependenciesCollection<T_RegisteredDependencies, T_DependencyKey>>;
    };

    public readonly hasMapping = <T_Key extends AllowedDependencyKey>(key: T_Key) => 
    {
        return this.registry.has(key);
    };

    public readonly build = () => 
    {
        return new DefaultDiScope(new Map(this.registry));
    };
}
