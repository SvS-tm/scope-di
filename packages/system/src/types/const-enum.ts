export type ConstEnumValues
<
    TEnum extends Record<string, string>,
    TKeys extends keyof TEnum = keyof TEnum
> =
(
    TEnum[TKeys] extends `${infer TValue}` 
        ? TValue
        : never
);

export type ConstEnum
<
    TEnum extends Record<string, string>,
    TKeys extends keyof TEnum = keyof TEnum
> =
    ConstEnumValues<TEnum, TKeys> | TEnum[TKeys];
