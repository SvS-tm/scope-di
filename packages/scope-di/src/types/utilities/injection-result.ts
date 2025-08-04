import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";
import type { RegisteredDependencies } from "../../types/registered-dependencies";
import type { GetDefaultDependencyMetadata } from "./get-default-dependency-metadata";

export type InjectionResult
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_DependencyKey extends AllowedDependencyKey
> = 
    GetDefaultDependencyMetadata<T_RegisteredDependencies, T_DependencyKey>["dependency"];
