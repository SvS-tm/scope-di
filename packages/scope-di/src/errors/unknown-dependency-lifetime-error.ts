import type { AllowedDependencyKey } from "../types/allowed-dependency-key";
import type { DependencyLifetime } from "../types/dependency-lifetime";

export class UnknownDependencyLifetimeError extends Error
{
    public constructor(key: AllowedDependencyKey, lifetime: DependencyLifetime)
    {
        super
        (
            `Can not resolve dependency by key ${key} as its lifetime is known: ${lifetime}!`, 
            { cause: { key, lifetime } }
        );
    }
}
