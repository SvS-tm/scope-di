export type ConstStringEnumValues
<
    TEnum extends Record<string, string>,
    TKeys extends keyof TEnum = keyof TEnum
> =
(
    TEnum[TKeys] extends `${infer TValue}` 
        ? TValue
        : never
);

export type ConstStringEnum
<
    TEnum extends Record<string, string>,
    TKeys extends keyof TEnum = keyof TEnum
> =
    ConstStringEnumValues<TEnum, TKeys> | TEnum[TKeys];
