import { Constructor } from "@svs-tm/system";
import { ClassInstantiationStrategy } from "../../../types/class-instantiation-strategy";
import { RegisteredDependencies } from "../../../types/registered-dependencies";

export function createZeroArgumentsClassStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Class extends Constructor<any[], any>
>
(
    Class: T_Class
)
    : ClassInstantiationStrategy<T_RegisteredDependencies, T_Class>
{
    return () => new Class();
}
