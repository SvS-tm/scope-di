import type { AllowedDependencyKey, DependencyDescriptorType } from "../../types";

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
