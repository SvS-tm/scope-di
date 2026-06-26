import type { ElementType, ReactNode } from "react";

export type UiFallback<T_Props extends object = {}> = 
(
    {
        component: ElementType<T_Props>;
    }
        |
    {
        node: ReactNode;
    }
);
