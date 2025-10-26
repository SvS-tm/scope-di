import { describe, it } from "@jest/globals";

/*
Suspense / pending

    - Suspends on async: when any requested dep is async, shows pending fallback, then renders resolved UI.
    - No flicker after resolve: once resolved, re-renders should not flash the pending fallback again.

Mixed graphs

    - Mixed sync/async keys: call suspends; after resolve, values are returned in the same key order.

Collections with async

    - Whole collection awaits: if any member is async, the collection result suspends; final array contains awaited items in reverse registration order.

Error propagation

    - Rejected dep: error fallback renders with the rejection reason.
*/
describe
(
    "dummy", 
    () => 
    {
        it("dummy", () => {});
    }
);
