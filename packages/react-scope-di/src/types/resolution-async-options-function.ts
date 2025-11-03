import { DiAsyncResolutionOptions } from "./di-async-resolution-options";
import type { ResolvedComponentOptions } from "./resolved-component-options";
import type { ResolvedComponentOptionsParameters } from "./resolved-component-options-parameters";

export type ResolutionAsyncOptionsFunction = <T_Props extends {} = {}>
(
    parameters?: ResolvedComponentOptionsParameters<DiAsyncResolutionOptions>
) 
    => ResolvedComponentOptions<T_Props, DiAsyncResolutionOptions> | undefined;
