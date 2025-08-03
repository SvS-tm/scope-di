import type { DependencyDescriptorType } from "../../types/dependency-descriptor-type";
import type { DependencyKey } from "../../types/dependency-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { InjectionResult } from "./injection-result";

export type AwaitedInjectionResult
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_Key extends DependencyKey<T_RegisteredDependencies>
> = 
(
    T_RegisteredDependencies[T_Key]["type"] extends DependencyDescriptorType.ClassAsync | DependencyDescriptorType.FactoryAsync
        ? InjectionResult<T_RegisteredDependencies, T_Key> extends Promise<infer T_Awaited> 
            ? T_Awaited 
            : InjectionResult<T_RegisteredDependencies, T_Key>
        : InjectionResult<T_RegisteredDependencies, T_Key>
);
