import type { AllowedDependencyKey } from "../../types";

export class DependencyNotRegisteredError extends Error
{
    public constructor(key: AllowedDependencyKey)
    {
        super
        (
            `Can not resolve dependency by key ${key} as it was not registered!`, 
            { cause: key }
        );
    }
}