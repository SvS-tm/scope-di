import type { DiScopeBuilder } from "../../abstractions";
import { UnknownDependencyTypeError } from "../../errors/unknown-dependency-type-error";
import { DependencyDescriptorType } from "../../types";
import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { DependencyDescriptor } from "../../types/dependency-descriptor";
import type { DependencyMappingKey } from "../../types/dependency-mapping-key";
import type { DependencyDescriptorsBucket } from "../../types/internals/dependency-descriptors-bucket";
import type { RuntimeDependencyDescriptor } from "../../types/internals/runtime-dependency-descriptor";
import { RuntimeDependencyDescriptorsBucket } from "../../types/internals/runtime-dependency-descriptors-bucket";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { RemoveDependenciesCollection } from "../../types/utilities/remove-dependencies-collection";
import { compileAsyncClassDescriptor } from "../instantiation-strategies/async/class-async/compile-async-class-descriptor";
import { compileAsyncFactoryDescriptor } from "../instantiation-strategies/async/factory-async/compile-async-factory-descriptor";
import { compileClassDescriptor } from "../instantiation-strategies/sync/class/compile-class-descriptor";
import { compileFactoryDescriptor } from "../instantiation-strategies/sync/factory/compile-factory-descriptor";
import { compileValueDescriptor } from "../instantiation-strategies/sync/value/compile-value-descriptor";
import { DefaultDiDependenciesRegistry } from "../registry/default-di-dependencies-registry";
import { DefaultDiScope } from "../scope/default-di-scope";
import { DefaultDiMappingBuilder } from "./default-di-mapping-builder";

export class DefaultDiScopeBuilder<T_RegisteredDependencies extends RegisteredDependencies = never> 
    implements DiScopeBuilder<T_RegisteredDependencies>
{
    private allowRuntimeCodeGeneration: boolean = false;
    private readonly descriptors = new Map<AllowedDependencyKey, DependencyDescriptorsBucket>();

    private compile(descriptor: DependencyDescriptor): RuntimeDependencyDescriptor
    {
        const { key, type } = descriptor;

        switch (descriptor.type)
        {
            case DependencyDescriptorType.Value:
                return compileValueDescriptor(descriptor);
            case DependencyDescriptorType.Class:
                return compileClassDescriptor(descriptor, this.allowRuntimeCodeGeneration);
            case DependencyDescriptorType.Factory:
                return compileFactoryDescriptor(descriptor, this.allowRuntimeCodeGeneration);
            case DependencyDescriptorType.ClassAsync:
                return compileAsyncClassDescriptor(descriptor, this.allowRuntimeCodeGeneration);
            case DependencyDescriptorType.FactoryAsync:
                return compileAsyncFactoryDescriptor(descriptor, this.allowRuntimeCodeGeneration);
            default:
                throw new UnknownDependencyTypeError(key, type);
        }
    }

    /**
     * @internal This is internal method, its not safe to use it.
     */
    public register(descriptor: DependencyDescriptor)
    {
        const descriptorOrCollection = this.descriptors.get(descriptor.key);

        if(!descriptorOrCollection)
            this.descriptors.set(descriptor.key, descriptor);
        else if(Array.isArray(descriptorOrCollection))
            descriptorOrCollection.unshift(descriptor);
        else
            this.descriptors.set(descriptor.key, [descriptor, descriptorOrCollection]);
    }

    public setAllowRuntimeCodeGeneration(value: boolean = true) 
    {
        this.allowRuntimeCodeGeneration = value;

        return this;
    }

    public map<T_DependencyMappingKey extends AllowedDependencyKey>(key: T_DependencyMappingKey)
    {
        return new DefaultDiMappingBuilder(this, key);
    }

    public removeMapping<T_DependencyMappingKey extends DependencyMappingKey<T_RegisteredDependencies>>
    (
        key: T_DependencyMappingKey
    )
    {
        this.descriptors.delete(key);

        return this as unknown as DiScopeBuilder<RemoveDependenciesCollection<T_RegisteredDependencies, T_DependencyMappingKey>>;
    }

    public hasMapping<T_DependencyMappingKey extends AllowedDependencyKey>(key: T_DependencyMappingKey)
    {
        return this.descriptors.has(key);
    }

    public build()
    {
        const compiledRegistrations = new Map<AllowedDependencyKey, RuntimeDependencyDescriptorsBucket>();

        for (const [key, descriptorOrCollection] of this.descriptors)
        {
            if (Array.isArray(descriptorOrCollection))
                compiledRegistrations.set(key, descriptorOrCollection.map(descriptor => this.compile(descriptor)));
            else
                compiledRegistrations.set(key, this.compile(descriptorOrCollection));
        }

        return new DefaultDiScope<T_RegisteredDependencies>
        (
            new DefaultDiDependenciesRegistry(compiledRegistrations)
        );
    }
}
