import type { ResolvedComponentOptions } from "../types/resolved-component-options";
import type { ResolvedComponentOptionsParameters } from "../types/resolved-component-options-parameters";

export const resolutionOptions = <T_Props extends {} = {}>
(
    parameters?: ResolvedComponentOptionsParameters
)
    : ResolvedComponentOptions<T_Props> | undefined =>
{
    return parameters;
};
