/** Constructs a dependency from already resolved arguments. */
export type ConstructionStrategy<T_Dependency>
    = (dependencies: unknown[]) => T_Dependency;
