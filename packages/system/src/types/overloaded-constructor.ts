import type { Overload } from "./overload";

export type OverloadedConstructor<T_Overloads extends Overload<any[], any>[]> = 
(
    T_Overloads extends [infer T_Overload, ...infer T_Else]
        ? T_Else extends Overload<any[], any>[]
            ? T_Overload extends [...infer T_Parameters, infer T_Result]
                ? (new (...parameters: T_Parameters) => T_Result) & OverloadedConstructor<T_Else>
                : {}
            : {}
        : {}
);
