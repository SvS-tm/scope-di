import { act, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { DiAwait } from "../internals/components/di-await";
import { describe, expect, it } from "@jest/globals";
import { asyncResolutionResultMarker } from "../internals/constants/is-async-resolution-result";

describe
(
    "DiAwait",
    () =>
    {
        it
        (
            "Works correctly with Suspense",
            async () =>
            {
                const { promise: rawPromise, resolve } = Promise.withResolvers<[]>();

                const promise = Object.assign(rawPromise, { [asyncResolutionResultMarker]: true } as const);

                const childId = "child";

                await act
                (
                    async () =>
                    {
                        render
                        (
                            <Suspense fallback={<span role="progressbar">Loading...</span>}>
                                <DiAwait result={promise}>
                                {
                                    () => (
                                        <span data-testid={childId}>Loaded!</span>
                                    )
                                }
                                </DiAwait>
                            </Suspense>
                        );
                    }
                );

                expect(screen.queryByRole("progressbar")).toBeInTheDocument();
                expect(screen.queryByTestId(childId)).not.toBeInTheDocument();

                await act(async () => resolve([]));

                expect(screen.queryByTestId(childId)).toBeInTheDocument();
                expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
            }
        );
    }
);
