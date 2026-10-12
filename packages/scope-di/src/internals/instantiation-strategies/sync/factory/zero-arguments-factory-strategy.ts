import { DependencyFactory } from "../../../../types/dependency-factory";
import { InstantiationStrategy } from "../../../../types/instantiation-strategy";

export function createZeroArgumentsFactoryStrategy<T_Factory extends DependencyFactory<any[], any>>
(
    factory: T_Factory
)
    : InstantiationStrategy<ReturnType<T_Factory>>
{
    return () => factory();
}
