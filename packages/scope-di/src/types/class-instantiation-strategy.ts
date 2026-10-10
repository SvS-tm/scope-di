import { Constructor } from "@svs-tm/system";
import { DiScope } from "../abstractions/di-scope";
import { RegisteredDependencies } from "./registered-dependencies";

export type ClassInstantiationStrategy
<
    T_RegisteredDependencies extends RegisteredDependencies, 
    T_Class extends Constructor<any[], any>
>
    = (scope: DiScope<T_RegisteredDependencies>) => InstanceType<T_Class>;
