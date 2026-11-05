export type ConstStringEnumValues
<
    T_Enum extends Record<string, string>,
    T_Keys extends keyof T_Enum = keyof T_Enum
>
    =
(
    T_Enum[T_Keys] extends `${infer T_Value}`
        ? T_Value
        : never
);

export type ConstStringEnum
<
    T_Enum extends Record<string, string>,
    T_Keys extends keyof T_Enum = keyof T_Enum
>
    = ConstStringEnumValues<T_Enum, T_Keys> | T_Enum[T_Keys];
