import { describe, expect, it, jest } from "@jest/globals";
import { Logging } from "./logging";

describe
(
    "Logging",
    () =>
    {
        it.each
        (
            [
                ["warning", "warn"],
                ["info", "info"],
                ["error", "error"]
            ] as const
        )
        (
            "%s prefixes the message and preserves extra arguments",
            (method, consoleMethod) =>
            {
                const output = jest.spyOn(console, consoleMethod).mockImplementation(() => {});
                const detail = {};
                const error = new Error("Original failure");

                Logging[method]("Message", detail, error);

                expect(output).toHaveBeenCalledTimes(1);
                expect(output).toHaveBeenCalledWith("[scope-di] Message", detail, error);
            }
        );
    }
);
