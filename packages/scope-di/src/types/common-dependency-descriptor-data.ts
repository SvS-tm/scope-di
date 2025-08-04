import type { AllowedDependencyKey } from "./allowed-dependency-key";
import type { DependencyLifetime } from "./dependency-lifetime";

export type CommonDependencyDescriptorData
<
    T_DependencyMappingKey extends AllowedDependencyKey = AllowedDependencyKey
> = 
{
    key: T_DependencyMappingKey;
    lifetime: DependencyLifetime;
};
