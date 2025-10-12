import { act, render, screen } from "@testing-library/react";
import { DiErrorBoundary } from "./di-error-boundary";
import { JSX } from "react";

describe
(
    "DiErrorBoundary",
    () =>
    {
        it
        (
            "Renders fallback correctly on render error",
            () =>
            {
                const fallbackText = "Fallback text";

                const Component = (): JSX.Element =>
                {
                    throw new Error();
                };

                act
                (
                    () => render
                    (
                        <DiErrorBoundary fallback={fallbackText}>
                            <Component />
                        </DiErrorBoundary>
                    )
                );

                expect(screen.queryByText(fallbackText)).toBeInTheDocument();
            }
        );

        it
        (
            "onError is called with thrown error on render error",
            () =>
            {
                const error = new Error();

                const Component = (): JSX.Element =>
                {
                    throw error;
                };

                const onError = jest.fn<void, [error: unknown, errorInfo: React.ErrorInfo]>();

                act
                (
                    () => 
                    {
                        render
                        (
                            <DiErrorBoundary fallback={"Error"} onError={onError}>
                                <Component />
                            </DiErrorBoundary>
                        );
                    }
                );

                expect(onError).toHaveBeenCalledTimes(1);
                expect(onError).toHaveBeenCalledWith(error, expect.anything());
            }
        );

        it
        (
            "Error fallback is rendered with thrown error as prop",
            () =>
            {
                const errorObject = { text: "Error happened" };

                const Component = (): JSX.Element =>
                {
                    throw errorObject;
                };

                const ErrorHandler = ({ error }: { error: unknown }) =>
                {
                    return <span>{(error as typeof errorObject)?.text}</span>;
                };

                act
                (
                    () => 
                    {
                        render
                        (
                            <DiErrorBoundary fallback={ErrorHandler}>
                                <Component />
                            </DiErrorBoundary>
                        );
                    }
                );

                expect(screen.queryByText(errorObject.text)).toBeInTheDocument();
            }
        );
    }
);
