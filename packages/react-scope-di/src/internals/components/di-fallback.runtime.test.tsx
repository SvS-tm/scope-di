import { act, render, screen } from "@testing-library/react";
import { DiFallback } from "./di-fallback";
import { describe, expect, it } from "@jest/globals";

describe
(
    "DiFallback",
    () =>
    {
        it
        (
            "Renders correctly rendered custom component's ReactNode",
            () =>
            {
                const id = "custom_component";

                const CustomComponent = () =>
                {
                    return <span data-testid={id}>Custom</span>;
                };

                act(() => render(<DiFallback fallback={{ node: <CustomComponent /> }} props={{}} />));

                expect(screen.queryByTestId(id)).toBeInTheDocument();
            }
        );

        it
        (
            "Renderes correctly string ReactNode",
            () =>
            {
                const text = "Test text";

                act(() => render(<DiFallback fallback={{ node: text }} props={{}} />));

                expect(screen.queryByText(text)).toBeInTheDocument();
            }
        );

        it
        (
            "Renderes correctly number ReactNode",
            () =>
            {
                const number = 1;

                act(() => render(<DiFallback fallback={{ node: number }} props={{}} />));

                expect(screen.queryByText(number)).toBeInTheDocument();
            }
        );

        it
        (
            "Renderes correctly custom function component with props",
            () =>
            {
                const id = "custom_component";
                const text = "Custom";

                const CustomComponent = ({ text }: { text: string }) =>
                {
                    return <span data-testid={id}>{text}</span>;
                };

                act(() => render(<DiFallback fallback={{ component: CustomComponent }} props={{ text }} />));

                const element = screen.queryByTestId(id);

                expect(element).toBeInTheDocument();
                expect(element).toHaveTextContent(text);
            }
        );
    }
);
