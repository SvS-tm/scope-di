import { act, render, screen } from "@testing-library/react";
import { DiSuspense } from "./di-suspense";
import { JSX } from "react";
import { describe, expect, it } from "@jest/globals";

describe
(
    "DiSuspense",
    () =>
    {
        it
        (
            "Renders correctly fallback",
            async () =>
            {
                const { promise } = Promise.withResolvers();

                const loaderId = "Loader";

                const Component = (): JSX.Element => 
                {
                    throw promise;
                };

                await act
                (
                    async () =>
                    {
                        render
                        (
                            <DiSuspense fallback={{ node: <span data-testid={loaderId}>Loading...</span> }}>
                                <Component />
                            </DiSuspense>
                        );
                    }
                );

                expect(screen.queryByTestId(loaderId)).toBeInTheDocument();
            }
        );
    }
);
