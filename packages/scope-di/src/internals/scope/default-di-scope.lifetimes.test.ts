import { describe } from "@jest/globals";

describe
(
    "default-di-scope: Lifetimes",
    () =>
    {
        /**
            Singleton
                • Resolving the same key twice in the same scope returns the same instance.
                • Resolving from a child scope still returns the same instance from the root.
                    
            Scoped
                • Resolving twice in the same scope returns the same instance.
                • Resolving in a child scope gives a different instance.
                    
            ScopedInherited
                • Resolving in a child scope returns the same instance from the nearest ancestor that has it.
                • If no ancestor has it, it is created in the current scope.
                    
            Transient
                • Always returns a new instance, even within the same scope.
         */
    }
);
