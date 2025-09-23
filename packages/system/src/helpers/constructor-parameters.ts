export type ConstructorParameters<T_Constructor extends new (...args: any[]) => any> = 
(
    T_Constructor extends new (...args: infer T_Args) => any 
        ? T_Args 
        : never
);
