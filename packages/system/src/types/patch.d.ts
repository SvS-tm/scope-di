export type Patch<T> = {
    -readonly [TKey in keyof T]: T[TKey];
};
