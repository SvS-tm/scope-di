import { createElement, type ReactNode } from "react";
import { isElement, isValidElementType } from "react-is";
import type { UiFallback } from "../../types";

export type DiFallbackProps<T_Props extends object> = 
{
    element: UiFallback<T_Props>;
    props: T_Props;
};

export function DiFallback<T_Props extends object>({ element, props }: DiFallbackProps<T_Props>)
{
    if (isElement(element))
        return element;

    const type = typeof element;

    if ((type === "object" || type === "function") && isValidElementType(element))
        return createElement(element, props);

    return element as ReactNode;
};
