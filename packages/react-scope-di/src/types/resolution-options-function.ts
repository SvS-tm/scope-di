import type { ResolvedComponentOptions } from "./resolved-component-options";
import type { ResolvedComponentOptionsParameters } from "./resolved-component-options-parameters";

export type ResolutionOptionsFunction = <T_Props extends {} = {}>
(
    parameters?: ResolvedComponentOptionsParameters
) 
    => ResolvedComponentOptions<T_Props> | undefined;
