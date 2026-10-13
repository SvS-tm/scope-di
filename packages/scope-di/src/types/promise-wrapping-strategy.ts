/** Wraps a construction result in a promise while preserving the chosen tracking behavior. */
export type PromiseWrappingStrategy<T_Dependency>
    = (value: T_Dependency | Promise<T_Dependency>) => Promise<T_Dependency>;
