import "core-js/actual/symbol/dispose";
import "core-js/actual/symbol/async-dispose";

const { error } = console;

const filteredMessagePatterns = [
    /.*React will try to recreate this component tree from scratch using the error boundary you provided.*/,
    /.*Consider adding an error boundary to your tree to customize error handling behavior.*/
];

console.error = (...args) =>
{
    for(const message of args)
    {
        switch (typeof message)
        {
            case "string":
            {
                // React error boundart exception
                if (filteredMessagePatterns.some(pattern => pattern.test(message)))
                {
                    return;
                }

                break;
            }
            case "object":
            {
                // JSDOM error boundary exception
                if (message.type === "unhandled exception")
                {
                    return;
                }

                break;
            }
        }
    }

    error(...args);
};

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
