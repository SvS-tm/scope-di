import { FeatureFlag } from "./feature-flag";

export type DiFeatures
<
    T_AllowModuleIsolation extends FeatureFlag = FeatureFlag, 
    T_AllowCodeGeneration extends FeatureFlag = FeatureFlag
> 
    =
{
    allowRuntimeModuleIsolation: T_AllowModuleIsolation;
    allowRuntimeCodeGeneration: T_AllowCodeGeneration;
};
