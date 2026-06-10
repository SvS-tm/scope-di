import { DependencyResolutionKey } from "@svs-tm/scope-di";
import { AllowedDependencyKey } from "@svs-tm/scope-di";
import { TrackedPromiseStatus } from "@svs-tm/system";

export class NotExpectedAsyncDependencyStateError extends Error
{
    public constructor(key: DependencyResolutionKey<AllowedDependencyKey>, status: TrackedPromiseStatus)
    {
        super
        (
            `Unexpected async dependency state: ${status}, key: ${Array.isArray(key) ? `[${key[0]}]` : key}`, 
            { cause: { status, key } }
        );
    }
}
