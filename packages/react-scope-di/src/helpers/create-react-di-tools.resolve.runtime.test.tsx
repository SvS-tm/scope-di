import { describe, expect, it, jest } from "@jest/globals";
import { configureRootScope, DependencyLifetime } from "@svs-tm/scope-di";
import { render, screen } from "@testing-library/react";
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
                const consumerId = "consumer";

                const scope = configureRootScope()
                    .map(key1)
                        .asValue(originalDependency1)
                    .map(key2)
                        .asValue(originalDependency2)
                    .map(key3)
                        .asValue(originalDependency3)
                    .build();

                const { resolve, resolutionOptions } = createReactDiTools(scope);

                const rendererSpy = jest.fn();

                type ConsumerProps =
                {
                    prop1: { value: string; };
                    prop2: { value: string; };
                };

                const Consumer = resolve
                (
                    ["Key1", "Key2", "Key3"], 
                    resolutionOptions<ConsumerProps>(),
                    ({ props: { prop1, prop2 }, dependencies: [dependency1, dependency2, dependency3] }) =>
                    {
                        rendererSpy(prop1, prop2, dependency1, dependency2, dependency3);

                        return <span data-testid={consumerId}>Resolved</span>;
                    }
                );

                render(<Consumer prop1={originalProp1} prop2={originalProp2} />);

                expect(rendererSpy).toHaveBeenCalledWith(originalProp1, originalProp2, originalDependency1, originalDependency2, originalDependency3);
                expect(screen.getByTestId(consumerId)).toBeInTheDocument();
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

                const { resolve, resolutionOptions } = createReactDiTools(scope);

                const errorSpy = jest.fn();

                const Consumer = resolve
                (
                    ["Key1"], 
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
        );

        it
        (
            "Local error fallback overrides global error fallback",
            () =>
            {
                const key1 = "Key1";
                const error = new Error();
                const globalErrorId = "global-error";
                const localErrorId = "local-error";

                const scope = configureRootScope()
                    .map(key1)
                        .asFactory(() => throwError<{ value: string; }>(error), DependencyLifetime.Singleton)
                    .build();

                const globalErrorSpy = jest.fn();
                const localErrorSpy = jest.fn();

                const { resolve, resolutionOptions } = createReactDiTools
                (
                    scope,
                    {
                        error: ({ error }) =>
                        {
                            globalErrorSpy(error);

                            return <span data-testid={globalErrorId}>Global error</span>;
                        }
                    }
                );

                const Consumer = resolve
                (
                    ["Key1"],
                    resolutionOptions
                    (
                        {
                            error: ({ error }) =>
                            {
                                localErrorSpy(error);

                                return <span data-testid={localErrorId}>Local error</span>;
                            }
                        }
                    ),
                    ({ dependencies: [dependency1] }) => <span>{dependency1.value}</span>
                );

                render(<Consumer />);

                expect(localErrorSpy).toHaveBeenCalledWith(error);
                expect(globalErrorSpy).not.toHaveBeenCalled();
                expect(screen.getByTestId(localErrorId)).toBeInTheDocument();
                expect(screen.queryByTestId(globalErrorId)).not.toBeInTheDocument();
            }
        );

        it
        (
            "Creates new scope if 'createNewScope' option is true",
            () =>
            {
                let counter = 0;
                const key1 = "Key1";

                const scope = configureRootScope()
                    .map(key1)
                        .asFactory(() => ({ index: ++counter }), DependencyLifetime.Scoped)
                    .build();

                const [rootDependency1] = scope.resolve(key1);

                const scopePrototype = Object.getPrototypeOf(scope) as typeof scope;

                const createChildScopeSpy = jest
                    .spyOn(scopePrototype, "createChildScope");

                const depedency1Spy = jest.fn();

                const { resolve, resolutionOptions } = createReactDiTools(scope);

                const Consumer = resolve
                (
                    ["Key1"], 
                    resolutionOptions({ createNewScope: true }),
                    ({ dependencies: [dependency1] }) =>
                    {
                        depedency1Spy(dependency1);

                        return (
                            <span data-testid={key1}>{dependency1.index}</span>
                        );
                    }
                );

                render(<Consumer />);

                expect(createChildScopeSpy).toHaveBeenCalledTimes(1);
                expect(depedency1Spy).not.toHaveBeenCalledWith(rootDependency1);

                const dependency1 = screen.queryByTestId(key1);

                expect(dependency1).toBeInTheDocument();
                expect(dependency1).toHaveTextContent(String(rootDependency1.index + 1));
            }
        );

        it
        (
            "Disposes scope created by 'createNewScope' option on unmount",
            () =>
            {
                const key1 = "Key1";
                const disposeSpy = jest.fn();

                const scope = configureRootScope()
                    .map(key1)
                        .asFactory
                        (
                            () => 
                            (
                                {
                                    value: "dependency",
                                    [Symbol.dispose]: disposeSpy
                                }
                            ),
                            DependencyLifetime.Scoped
                        )
                    .build();

                const { resolve, resolutionOptions } = createReactDiTools(scope);

                const Consumer = resolve
                (
                    ["Key1"],
                    resolutionOptions({ createNewScope: true }),
                    ({ dependencies: [dependency1] }) => <span data-testid={key1}>{dependency1.value}</span>
                );

                const { unmount } = render(<Consumer />);

                expect(screen.getByTestId(key1)).toHaveTextContent("dependency");
                expect(disposeSpy).not.toHaveBeenCalled();

                unmount();

                expect(disposeSpy).toHaveBeenCalledTimes(1);
            }
        );
    }
);
