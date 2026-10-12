import { Constructor } from "@svs-tm/system";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";

export function createZeroArgumentsClassStrategy<T_Constructor extends Constructor<any[], any>>
(
    constructor: T_Constructor
)
    : InstantiationStrategy<InstanceType<T_Constructor>>
{
    return () => new constructor();
}
