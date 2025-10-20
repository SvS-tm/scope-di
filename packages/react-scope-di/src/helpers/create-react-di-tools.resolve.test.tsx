/*
Props → injections

    - Maps keys to props: injected values are passed as props; component receives them with correct names/types.
    - Multiple keys: all requested deps injected; prop order doesn’t matter but each prop gets the right value.

Lifetimes (spot check)

    - Scoped: same prop instance across re-renders within the same <DiScope>, different across sibling scopes.
    - Singleton: same instance across all <DiScope> sharing root.

Collections

    - Reverse order & duplicates: injected collection matches DI semantics.

Errors

    - Sync failure: thrown constructor/factory error surfaces through ErrorBoundary.
*/
describe
(
    "dummy", 
    () => 
    {
        it("dummy", () => {});
    }
);
