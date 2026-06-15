import { describe, expect, it } from "@jest/globals";
import { TrackedPromiseStatus } from "@svs-tm/system";
import { NotExpectedAsyncDependencyStateError } from "./not-expected-async-dependency-state-error";

describe
(
    "NotExpectedAsyncDependencyStateError",
    () =>
    {
        it
        (
            "formats the unexpected async state and key in the error",
            () =>
            {
                const error = new NotExpectedAsyncDependencyStateError(["dependency"], TrackedPromiseStatus.Pending);

                expect(error.message).toBe("Unexpected async dependency state: 0, key: [dependency]");
                expect(error.cause).toStrictEqual({ status: TrackedPromiseStatus.Pending, key: ["dependency"] });
            }
        );

        it
        (
            "formats singular keys without collection brackets",
            () =>
            {
                const error = new NotExpectedAsyncDependencyStateError("dependency", TrackedPromiseStatus.Error);

                expect(error.message).toBe("Unexpected async dependency state: 2, key: dependency");
                expect(error.cause).toStrictEqual({ status: TrackedPromiseStatus.Error, key: "dependency" });
            }
        );
    }
);
