import type { RegisteredDependencies } from "../registered-dependencies";
import type { AllowedDependencyKey } from "../allowed-dependency-key";

export type RemoveDependenciesCollection
<
    T_RegisteredDependencies extends RegisteredDependencies,
    T_ExistingKey extends AllowedDependencyKey
> = 
(
    T_RegisteredDependencies["key"] extends T_ExistingKey
        ? never
        : T_RegisteredDependencies
);
