import { DependencyDescriptor, DependencyDescriptorType } from "../types";
import { AsyncDependencyDescriptor } from "../types/async-dependency-descriptor";

export function isAsyncDescriptor(descriptor: DependencyDescriptor): descriptor is AsyncDependencyDescriptor
{
    return (
        descriptor.type === DependencyDescriptorType.ClassAsync 
            || 
        descriptor.type === DependencyDescriptorType.FactoryAsync
    );
}
