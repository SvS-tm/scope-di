import { DependencyFactory } from "../../../types/dependency-factory";
import { RegisteredDependencies } from "../../../types/registered-dependencies";
import { FactoryInstantiationStrategy } from "../../../types/factory-instantiation-strategy";

export function createZeroArgumentsFactoryStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Factory extends DependencyFactory<any[], any>
>
(
    factory: T_Factory
)
    : FactoryInstantiationStrategy<T_RegisteredDependencies, T_Factory>
{
    return () => factory();
}

