import { act, render, screen } from "@testing-library/react";
import { createContext } from "react";
import { useContextValue } from "../hooks/use-context-value";
import { DiContextProvider } from "./di-context-provider";

describe
(
    "DiContextProvider",
    () =>
    {
        it
        (
            "Provides value to child component",
            () =>
            {
                const id = "value_id";
                const value = "Test value";
                const context = createContext("");

                const Component = () =>
                {
                    const value = useContextValue(context);

                    return <span data-testid={id}>{value}</span>;
                };

                act
                (
                    () =>
                    {
                        render
                        (
                            <DiContextProvider context={context} value={value}>
                                <Component />
                            </DiContextProvider>
                        );
                    }
                );

                const element = screen.getByTestId(id);

                expect(element).toBeInTheDocument();
                expect(element).toHaveTextContent(value);
            }
        );
    }
);
