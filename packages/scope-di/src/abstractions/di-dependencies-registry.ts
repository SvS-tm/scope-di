import { AllowedDependencyKey, DependencyDescriptor, DependencyResolutionKey } from "../types";

export type DiDependenciesRegistry = 
{
    getDescriptors(): readonly DependencyDescriptor[];

    resolveDescriptorsByKey(key: DependencyResolutionKey<AllowedDependencyKey>): DependencyDescriptor | readonly DependencyDescriptor[];
    
    resolveDescriptorsByKeys(...keys: DependencyResolutionKey<string>[]): Generator<DependencyDescriptor, void, unknown>;
};
