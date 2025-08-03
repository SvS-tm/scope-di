import type { AllowedDependencyKey } from "../../types/allowed-dependency-key";

export type IsAllowedDependencyKey<T_Key> = T_Key extends AllowedDependencyKey
    ? T_Key
    : never;
