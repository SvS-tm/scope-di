/*
Pending → resolved

    - Suspends then renders: shows pending fallback from surrounding DiScope, then injects awaited props and renders child.
    - No post-resolve flicker: once props are injected, re-rendering the HOC shouldn’t re-suspend unless dependencies change to a new pending state.

Mixed & collections

    - Mixed sync/async: HOC suspends as needed; injects all awaited props in the end.

    - Collections: awaited collection injected in reverse registration order.

Errors

    - Rejected dep: triggers ErrorBoundary and renders error fallback with reason.
*/
 describe
(
    "dummy", 
    () => 
    {
        it("dummy", () => {});
    }
);
