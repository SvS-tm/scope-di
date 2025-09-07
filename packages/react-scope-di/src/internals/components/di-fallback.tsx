import { createElement, isValidElement, type ReactNode } from "react";
import { isValidElementType } from "react-is";
import type { UiFallback } from "../../types";

export type DiFallbackProps<T_Props extends object> = 
{
    element: UiFallback<T_Props>;
    props: T_Props;
};

export const DiFallback = <T_Props extends object>({ element, props }: DiFallbackProps<T_Props>) =>
{
    if (isValidElement(element))
        return element;

    if (isValidElementType(element))
        return createElement(element, props);

    return element as ReactNode;
};
