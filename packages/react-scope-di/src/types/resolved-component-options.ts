import { ResolvedComponentOptionsParameters } from "./resolved-component-options-parameters";

/**
 * @note hack to make T_Props persist for compiler static analyzis
 */
declare const resolvedComponentPropsMarker: unique symbol;

export type ResolvedComponentOptions<T_Props, T_ResolutionOptions> =
(
    ResolvedComponentOptionsParameters<T_ResolutionOptions>
        &
    {
        [resolvedComponentPropsMarker]?: T_Props;
    }
);
