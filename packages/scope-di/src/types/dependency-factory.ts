import type { Delegate } from "@svs-tm/system";

/**
 * @description Factory type, represents dependency factory in DI
 */
export type DependencyFactory<T_SubDependencies extends unknown[], T_Dependency> = 
    Delegate<T_SubDependencies, T_Dependency>;
