import type { AllowedDependencyKey } from "../types/allowed-dependency-key";
import type { DependencyDescriptorType } from "../types/dependency-descriptor-type";

export class UnknownDependencyTypeError extends Error
{
    public constructor(key: AllowedDependencyKey, type: DependencyDescriptorType)
    {
        super
        (
            `Can not resolve dependency by key ${key} as its type is known: ${type}!`, 
            { cause: { key, type } }
        );
    }
}
