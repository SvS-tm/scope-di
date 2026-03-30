import type { Overload } from "./overload";
export type OverloadedDelegate<T_Overloads extends Overload<any[], any>[]> = (T_Overloads extends [infer T_Overload, ...infer T_Else] ? T_Else extends Overload<any[], any>[] ? T_Overload extends Overload<infer T_Parameters, infer T_Result> ? ((...parameters: T_Parameters) => T_Result) & OverloadedDelegate<T_Else> : {} : {} : {});
