export type Writable<T_Type> = 
{
    -readonly [T_Key in keyof T_Type]: T_Type[T_Key];
};
