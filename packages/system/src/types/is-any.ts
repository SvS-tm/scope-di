export type IsAny<T_Type, T_True = true, T_False = false> = 
(
    0 extends (1 & T_Type)
        ? T_True
        : T_False
);
