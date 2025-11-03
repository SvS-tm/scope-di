import { DiResolutionOptions } from "./di-resolution-options";
import type { ResolvedComponentOptions } from "./resolved-component-options";
import type { ResolvedComponentOptionsParameters } from "./resolved-component-options-parameters";

export type ResolutionOptionsFunction = <T_Props extends {} = {}>
(
    parameters?: ResolvedComponentOptionsParameters<DiResolutionOptions>
) 
    => ResolvedComponentOptions<T_Props, DiResolutionOptions> | undefined;
