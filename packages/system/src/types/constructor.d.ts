export type Constructor<T_Parameters extends any[] = [], T_Result = void> = new (...args: T_Parameters) => T_Result;
