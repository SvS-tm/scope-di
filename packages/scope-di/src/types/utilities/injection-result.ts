import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";

export type InjectionResult
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyKey extends AllowedDependencyKey
> = 
    T_RegisteredDependencies[T_DependencyKey]["dependency"];
