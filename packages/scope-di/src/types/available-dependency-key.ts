import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependencyKey } from "./dependency-key";
import type { RegisteredDependencies } from "./registered-dependencies";

export type AvailableDependencyKey
<
    T_PotentialDependencyKey extends AllowedDependencyKey, 
    T_RegisteredDependencies extends RegisteredDependencies
> = 
(
    T_PotentialDependencyKey extends DependencyKey<T_RegisteredDependencies>
        ? never
        : T_PotentialDependencyKey
);
