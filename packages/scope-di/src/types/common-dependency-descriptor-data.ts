import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependencyLifetime } from "./dependency-lifetime";

export type CommonDependencyDescriptorData
<
    T_DependencyKey extends AllowedDependencyKey = AllowedDependencyKey
> = 
{
    key: T_DependencyKey;
    lifetime: DependencyLifetime;
};
