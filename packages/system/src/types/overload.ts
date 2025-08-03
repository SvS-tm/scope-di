export type Overload<T_Parameters extends any[] = [], T_Result = void> = 
    [...T_Parameters, T_Result];
