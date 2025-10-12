import { act, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { DiAwait } from "./di-await";

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
                const { promise, resolve } = Promise.withResolvers<void>();

                const childId = "child";

                await act
                (
                    async () =>
                    {
                        render
                        (
                            <Suspense fallback={<span role="progressbar">Loading...</span>}>
                                <DiAwait promise={promise}>
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

                await act(async () => resolve());

                expect(screen.queryByTestId(childId)).toBeInTheDocument();
                expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
            }
        );
    }
);
