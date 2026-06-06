import { isSafeReference } from "@svs-tm/system";
import { DependencyDescriptor, DependencyDescriptorType, RegisteredDependencies } from "../../types";
import { DefaultDiScope } from "../scope/default-di-scope";

export class DefaultDependenciesGraph<T_RegisteredDependencies extends RegisteredDependencies>
{
    public constructor(private readonly scope: DefaultDiScope<T_RegisteredDependencies>)
    {
    }

    public *scanDependencies(descriptor: DependencyDescriptor)
    {
        switch (descriptor.type)
        {
            case DependencyDescriptorType.Class:
            case DependencyDescriptorType.ClassAsync:
            case DependencyDescriptorType.Factory:
            case DependencyDescriptorType.FactoryAsync:
            {
                if (isSafeReference(descriptor.subDependenciesKeys))
                {
                    for (const key of descriptor.subDependenciesKeys)
                    {
                        const descriptorOrCollection = this.scope.registry.resolveDescriptorsByKey(key);

                        if (Array.isArray(descriptorOrCollection))
                        {
                            for (const descriptor of descriptorOrCollection)
                                yield descriptor;
                        }
                        else
                            yield descriptorOrCollection;
                    }
                }   
            }
        }
    }
}

// 1) Scanning resolved dependencies
// 2) Scanning potential dependencies

/**
 * @todo move out abstraction of registry with some common logic like descriptors resolution etc
 * 
 */
