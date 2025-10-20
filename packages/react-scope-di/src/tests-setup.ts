import "core-js/actual/symbol/dispose";
import "core-js/actual/symbol/async-dispose";

process.on
(
    "unhandledRejection", 
    (reason, promise) => 
    {
        console.error
        (
            "Unhandled Rejection at:", 
            promise, 
            "reason:", 
            reason
        );
    }
);
