import { createElement } from "react";
import type { UiFallback } from "../../types";

export type DiFallbackProps<T_Props extends object> = 
{
    fallback: UiFallback<T_Props> | undefined;
    props: T_Props;
};

export function DiFallback<T_Props extends object>({ fallback, props }: DiFallbackProps<T_Props>)
{
    if (!fallback)
        return null;

    if ("component" in fallback)
        return createElement(fallback.component, props);

    return fallback.node;
};
