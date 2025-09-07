import type { ElementType, ReactNode } from "react";

export type UiFallback<T_Props extends object = {}> = 
    ReactNode | ElementType<T_Props>;
