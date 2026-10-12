import { DefaultDiScope } from "../internals/scope/default-di-scope";
import { RegisteredDependencies } from "./registered-dependencies";

export type InstantiationStrategy<T_Dependency>
    = (scope: DefaultDiScope<RegisteredDependencies>) => T_Dependency;
