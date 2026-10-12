import { Constructor, TrackedPromise } from "@svs-tm/system";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";

export function createZeroArgumentsAsyncClassStrategy<T_Constructor extends Constructor<any[], any>>
(
    constructor: T_Constructor
)
    : InstantiationStrategy<Promise<InstanceType<T_Constructor>>>
{
    return () => TrackedPromise.resolved(new constructor());
}
