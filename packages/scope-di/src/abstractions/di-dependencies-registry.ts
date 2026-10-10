import { AllowedDependencyKey, DependencyDescriptor, DependencyResolutionKey } from "../types";

export type DiDependenciesRegistry = 
{
    getDescriptors(): readonly DependencyDescriptor[];

    resolveCollectionDescriptorsByKey(mappingKey: AllowedDependencyKey): readonly DependencyDescriptor[];
    
    resolveSingularDescriptorByKey(mappingKey: AllowedDependencyKey): DependencyDescriptor;

    resolveDescriptorsByKey(key: DependencyResolutionKey<AllowedDependencyKey>): DependencyDescriptor | readonly DependencyDescriptor[];
    
    resolveDescriptorsByKeys(...keys: DependencyResolutionKey<string>[]): Generator<DependencyDescriptor, void, unknown>;

    isAsyncKey(key: DependencyResolutionKey<AllowedDependencyKey>): boolean;
};
