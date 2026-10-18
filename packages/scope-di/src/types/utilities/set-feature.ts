import { DiFeatures } from "../di-features";
import { FeatureFlag } from "../feature-flag";

export type SetFeature
<
    T_DiFeatures extends DiFeatures, 
    T_Feature extends keyof T_DiFeatures, 
    T_Value extends FeatureFlag
>
    = 
{
    [T_Key in keyof T_DiFeatures]: T_Key extends T_Feature
        ? T_Value
        : T_DiFeatures[T_Key];
};
