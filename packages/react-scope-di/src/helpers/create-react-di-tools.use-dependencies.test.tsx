/* 
Sync resolution

    - Single key: value/class/factory resolves and renders expected output.
    - Multiple keys: returns values in the order requested (tuple order preserved).

Collections

    - Reverse registration order: registering A, then B, then C under the same key resolves as [C, B, A].
    - Duplicates included: if the same instance is registered twice, both entries are present.

Lifetimes

    - Transient: new instance per resolution.
    - Scoped: same instance within one <DiScope>, different across sibling <DiScope> mounts.
    - ScopedInherited: shared along a branch (ancestor ↔︎ descendant), distinct across other branches.
    - Singleton: same instance across all <DiScope> mounts for the same root scope.

Sub-dependencies (constructor/factory)

    - Sync sub-deps: classes/factories receive correct instances in parameter order.
    - Collections as sub-deps: class/factory depending on a collection receives the expanded array with correct order/identity.

*/
describe
(
    "dummy", 
    () => 
    {
        it("dummy", () => {});
    }
);
