export type TupleKeys<T_Tuple extends readonly any[]> = 
    Exclude<keyof T_Tuple, keyof any[]>;
