import { DiScope } from "../abstractions/di-scope";
import { DependencyFactory } from "./dependency-factory";
import { RegisteredDependencies } from "./registered-dependencies";

export type FactoryInstantiationStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Factory extends DependencyFactory<any[], any>
>
    = (scope: DiScope<T_RegisteredDependencies>) => ReturnType<T_Factory>;

