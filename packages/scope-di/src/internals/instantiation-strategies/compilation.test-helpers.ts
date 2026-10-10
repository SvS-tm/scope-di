import { UnknownDependencyTypeError } from "../../errors/unknown-dependency-type-error";
import { AllowedDependencyKey, DependencyDescriptor, DependencyDescriptorType } from "../../types";
import { DependencyDescriptorsBucket } from "../../types/internals/dependency-descriptors-bucket";
import { RuntimeDependencyDescriptor } from "../../types/internals/runtime-dependency-descriptor";
import { RuntimeDependencyDescriptorsBucket } from "../../types/internals/runtime-dependency-descriptors-bucket";
import { compileAsyncClassDescriptor } from "./async/class-async/compile-async-class-descriptor";
import { compileAsyncFactoryDescriptor } from "./async/factory-async/compile-async-factory-descriptor";
import { compileClassDescriptor } from "./sync/class/compile-class-descriptor";
import { compileFactoryDescriptor } from "./sync/factory/compile-factory-descriptor";
import { compileValueDescriptor } from "./sync/value/compile-value-descriptor";

export function compileTestDescriptor(descriptor: DependencyDescriptor): RuntimeDependencyDescriptor
{
    const { key, type } = descriptor;

    switch (descriptor.type)
    {
        case DependencyDescriptorType.Value:
            return compileValueDescriptor(descriptor);
        case DependencyDescriptorType.Class:
            return compileClassDescriptor(descriptor, false);
        case DependencyDescriptorType.Factory:
            return compileFactoryDescriptor(descriptor, false);
        case DependencyDescriptorType.ClassAsync:
            return compileAsyncClassDescriptor(descriptor, false);
        case DependencyDescriptorType.FactoryAsync:
            return compileAsyncFactoryDescriptor(descriptor, false);
        default:
            throw new UnknownDependencyTypeError(key, type);
    }
}

export function compileTestRegistrations(registrations: ReadonlyMap<AllowedDependencyKey, DependencyDescriptorsBucket>)
{
    const compiledRegistrations = new Map<AllowedDependencyKey, RuntimeDependencyDescriptorsBucket>();

    for (const [key, descriptorOrCollection] of registrations)
    {
        compiledRegistrations.set
        (
            key,
            Array.isArray(descriptorOrCollection)
                ? descriptorOrCollection.map(compileTestDescriptor)
                : compileTestDescriptor(descriptorOrCollection)
        );
    }

    return compiledRegistrations;
}
