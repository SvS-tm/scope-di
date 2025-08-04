export type IsNever<T_Type, T_True = true, T_False = false> = 
(
    [T_Type] extends [never]
        ? T_True
        : T_False
);
