import { describe, expect, it, jest } from "@jest/globals";
import { configureRootScope, DependencyLifetime } from "@svs-tm/scope-di";
import { render, screen, within } from "@testing-library/react";
import { createReactDiTools } from "./create-react-di-tools";
import { throwError } from "@svs-tm/system";

describe
(
    "resolve", 
    () => 
    {
        it
        (
            "Props and dependencies are injected correctly", 
            () => 
            {
                const key1 = "Key1";
                const key2 = "Key2";
                const key3 = "Key3";
                const originalDependency1 = { value: "originalDependency1" };
                const originalDependency2 = { value: "originalDependency2" };
                const originalDependency3 = { value: "originalDependency3" };

                const originalProp1 = { value: "prop1" };
                const originalProp2 = { value: "prop2" };

                const scope = configureRootScope()
                    .map(key1)
                        .asValue(originalDependency1)
                    .map(key2)
                        .asValue(originalDependency2)
                    .map(key3)
                        .asValue(originalDependency3)
                    .build();

                const { resolve, resolutionKeys, resolutionOptions } = createReactDiTools(scope);

                const rendererSpy = jest.fn();

                type ConsumerProps =
                {
                    prop1: { value: string; };
                    prop2: { value: string; };
                };

                const Consumer = resolve
                (
                    resolutionKeys("Key1", "Key2", "Key3"), 
                    resolutionOptions<ConsumerProps>(),
                    ({ props: { prop1, prop2 }, dependencies: [dependency1, dependency2, dependency3] }) =>
                    {
                        rendererSpy(prop1, prop2, dependency1, dependency2, dependency3);

                        return (
                            <ol>
                                <li data-testid={prop1.value}>{prop1.value}</li>
                                <li data-testid={prop2.value}>{prop2.value}</li>
                                <li data-testid={dependency1.value}>{dependency1.value}</li>
                                <li data-testid={dependency2.value}>{dependency2.value}</li>
                                <li data-testid={dependency3.value}>{dependency3.value}</li>
                            </ol>
                        );
                    }
                );

                render(<Consumer prop1={originalProp1} prop2={originalProp2} />);

                expect(rendererSpy).toHaveBeenCalledWith(originalProp1, originalProp2, originalDependency1, originalDependency2, originalDependency3);
                
                const list = screen.getByRole("list");

                expect(list).toBeInTheDocument();

                const prop1 = within(list).queryByTestId(originalProp1.value);

                expect(prop1).toBeInTheDocument();
                expect(prop1).toHaveTextContent(originalProp1.value);

                const prop2 = within(list).queryByTestId(originalProp2.value);

                expect(prop2).toBeInTheDocument();
                expect(prop2).toHaveTextContent(originalProp2.value);

                const dependency1 = within(list).queryByTestId(originalDependency1.value);

                expect(dependency1).toBeInTheDocument();
                expect(dependency1).toHaveTextContent(originalDependency1.value);

                const dependency2 = within(list).queryByTestId(originalDependency2.value);

                expect(dependency2).toBeInTheDocument();
                expect(dependency2).toHaveTextContent(originalDependency2.value);

                const dependency3 = within(list).queryByTestId(originalDependency3.value);

                expect(dependency3).toBeInTheDocument();
                expect(dependency3).toHaveTextContent(originalDependency3.value);
            }
        );

        it
        (
            "Error boundary captures injection errors",
            () =>
            {
                const key1 = "Key1";
                const error = new Error();
                const errorSpanId = "error-span";
                const errorSpanContent = "Error!";

                const scope = configureRootScope()
                    .map(key1)
                        .asFactory(() => throwError<{ value: string; }>(error), DependencyLifetime.Singleton)
                    .build();

                const { resolve, resolutionKeys, resolutionOptions } = createReactDiTools(scope);

                const errorSpy = jest.fn();

                const Consumer = resolve
                (
                    resolutionKeys("Key1"), 
                    resolutionOptions
                    (
                        { 
                            error: ({ error }) =>  
                            {
                                errorSpy(error);

                                return <span data-testid={errorSpanId}>{errorSpanContent}</span>;
                            }
                        }
                    ),
                    ({ dependencies: [dependency1] }) =>
                    {
                        return (
                            <ol>
                                <li data-testid={dependency1.value}>{dependency1.value}</li>
                            </ol>
                        );
                    }
                );

                render(<Consumer />);

                expect(errorSpy).toHaveBeenCalledWith(error);

                const errorSpan = screen.getByTestId(errorSpanId);

                expect(errorSpan).toBeInTheDocument();
                expect(errorSpan).toHaveTextContent(errorSpanContent);
            }
        )
    }
);
