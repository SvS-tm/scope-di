export type Patch<T_Value> =
{
    -readonly [T_Key in keyof T_Value]: T_Value[T_Key];
};
