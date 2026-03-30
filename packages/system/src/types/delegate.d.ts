export type Delegate<T_Parameters extends any[] = [], T_Result = void> = (...args: T_Parameters) => T_Result;
