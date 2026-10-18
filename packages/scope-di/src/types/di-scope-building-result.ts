import { DiScope } from "../abstractions";
import { DiFeatures } from "./di-features";
import { RegisteredDependencies } from "./registered-dependencies";

/**
 * false builds synchronously; true and "auto" always return a Promise.
 * Unknown isolation flags keep both possible results in the type.
 */
export type DiScopeBuildingResult
<
    T_RegisteredDependencies extends RegisteredDependencies, 
    T_Features extends DiFeatures
>
    =
(
    T_Features["allowRuntimeModuleIsolation"] extends false
        ? DiScope<T_RegisteredDependencies>
        : T_Features["allowRuntimeModuleIsolation"] extends true | "auto"
            ? Promise<DiScope<T_RegisteredDependencies>>
            : DiScope<T_RegisteredDependencies> | Promise<DiScope<T_RegisteredDependencies>>
);
