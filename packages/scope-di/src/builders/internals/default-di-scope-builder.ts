import type { DiScopeBuilder } from "../abstractions";
import { DefaultDiScope } from "../../scope/internals/default-di-scope";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { AvailableDependencyKey } from "../../types/available-dependency-key";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import type { DependencyKey } from "../../types/dependency-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { RemoveDependency } from "../../types/utilities/remove-dependency";
import { DefaultDiMappingBuilder } from "./default-di-mapping-builder";

export class DefaultDiScopeBuilder<T_RegisteredDependencies extends RegisteredDependencies = {}> 
    implements DiScopeBuilder<T_RegisteredDependencies>
{
    private readonly descriptors = new Map<AllowedDependencyKey, DependencyDescriptor>();

    public readonly register = (descriptor: DependencyDescriptor) =>
    {
        this.descriptors.set(descriptor.key, descriptor);
    };

    public readonly map = <T_DependencyKey extends AllowedDependencyKey>
    (
        key: AvailableDependencyKey<T_DependencyKey, T_RegisteredDependencies>
    ) =>
    {
        return new DefaultDiMappingBuilder(this, key);
    };

    public readonly removeMapping = 
    <
        T_DependencyKey extends DependencyKey<T_RegisteredDependencies>
    >
        (key: T_DependencyKey) => 
    {
        this.descriptors.delete(key);

        return this as DiScopeBuilder<RemoveDependency<T_RegisteredDependencies, T_DependencyKey>>;
    };

    public readonly hasMapping = <T_Key extends AllowedDependencyKey>(key: T_Key) => 
    {
        return this.descriptors.has(key);
    };

    public readonly build = () => 
    {
        return new DefaultDiScope(new Map(this.descriptors));
    };
}
