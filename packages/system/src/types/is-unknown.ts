import { IsAny } from "./is-any";

export type IsUnknown<T_Type, T_True = true, T_False = false> = 
(
    IsAny<T_Type> extends true
        ? T_False
        : [unknown] extends [T_Type]
            ? T_True
            : T_False
);
