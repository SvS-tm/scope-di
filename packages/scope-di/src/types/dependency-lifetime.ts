export enum DependencyLifetime
{
    /**
     * Dependency will be created in every inject
     */
    Transient,
    /**
     * Dependency will be created once per **CURRENT** scope
     */
    Scoped,
    /**
     * Dependency will be created once per **SCOPE HIERARCHY BRANCH**
     * @description At first it will lookup parent scopes for dependency,
     * and if none found - it will create it in current scope
     */
    ScopedInherited,
    /**
     * Dependency will be created once per **ROOT SCOPE**
     */
    Singleton
}
