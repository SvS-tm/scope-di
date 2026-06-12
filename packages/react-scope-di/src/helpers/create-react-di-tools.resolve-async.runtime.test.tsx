import { describe, expect, it, jest } from "@jest/globals";
import { configureRootScope, DependencyLifetime } from "@svs-tm/scope-di";
import { throwError } from "@svs-tm/system";
import { act, render, screen, within } from "@testing-library/react";
import { createReactDiTools } from "./create-react-di-tools";

describe
(
    "resolveAsync", 
    () => 
    {
        it
        (
            "Props and dependencies are injected correctly", 
            async () => 
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

                const { resolveAsync, resolutionKeys, asyncResolutionOptions } = createReactDiTools(scope);

                const rendererSpy = jest.fn();

                type ConsumerProps =
                {
                    prop1: { value: string; };
                    prop2: { value: string; };
                };

                const Consumer = resolveAsync
                (
                    resolutionKeys("Key1", "Key2", "Key3"), 
                    asyncResolutionOptions<ConsumerProps>(),
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

                await act(async () => render(<Consumer prop1={originalProp1} prop2={originalProp2} />));

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
            async () =>
            {
                const key1 = "Key1";
                const error = new Error();
                const errorSpanId = "error-span";
                const errorSpanContent = "Error!";

                const scope = configureRootScope()
                    .map(key1)
                        .asFactory(() => throwError<{ value: string; }>(error), DependencyLifetime.Singleton)
                    .build();

                const { resolveAsync, resolutionKeys, asyncResolutionOptions } = createReactDiTools(scope);

                const errorSpy = jest.fn();

                const Consumer = resolveAsync
                (
                    resolutionKeys("Key1"), 
                    asyncResolutionOptions
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

                await act(async () => render(<Consumer />));

                expect(errorSpy).toHaveBeenCalledWith(error);

                const errorSpan = screen.getByTestId(errorSpanId);

                expect(errorSpan).toBeInTheDocument();
                expect(errorSpan).toHaveTextContent(errorSpanContent);
            }
        );

        it
        (
            "Suspends until all dependencies are resolved",
            async () =>
            {
                const key1 = "Key1";
                const originalDependency1 = { value: "dependency1" };
                const loaderText = "Loading...";

                const { promise, resolve } = Promise.withResolvers<typeof originalDependency1>();

                const scope = configureRootScope()
                    .map(key1)
                        .asFactoryAsync(() => promise, DependencyLifetime.Singleton)
                    .build();

                const { resolveAsync, resolutionKeys, asyncResolutionOptions } = createReactDiTools(scope);

                const resolutionSpy = jest.fn();

                const Consumer = resolveAsync
                (
                    resolutionKeys("Key1"), 
                    asyncResolutionOptions
                    (
                        { 
                            pending: <span role="progressbar">{loaderText}</span>
                        }
                    ),
                    ({ dependencies: [dependency1] }) =>
                    {
                        resolutionSpy(dependency1);

                        return (
                            <ol>
                                <li data-testid={dependency1.value}>{dependency1.value}</li>
                            </ol>
                        );
                    }
                );

                await act(async () => render(<Consumer />));

                const loader = screen.queryByRole("progressbar");

                expect(loader).toBeInTheDocument();
                expect(loader).toHaveTextContent(loaderText);

                expect(resolutionSpy).not.toHaveBeenCalled();

                await act
                (
                    async () => 
                    {
                        resolve(originalDependency1);

                        await promise;
                    }
                );

                expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

                expect(resolutionSpy).toHaveBeenCalledWith(originalDependency1);

                const dependency1 = screen.queryByTestId(originalDependency1.value);

                expect(dependency1).toBeInTheDocument();
                expect(dependency1).toHaveTextContent(originalDependency1.value);
            }
        );

        it
        (
            "Creates new scope if 'createNewScope' option is true",
            async () =>
            {
                let counter = 0;
                const key1 = "Key1";

                const scope = configureRootScope()
                    .map(key1)
                        .asFactoryAsync(async () => ({ index: ++counter }), DependencyLifetime.Scoped)
                    .build();

                const [rootDependency1] = await scope.resolveAsync(key1);

                const scopePrototype = Object.getPrototypeOf(scope) as typeof scope;

                const createChildScopeSpy = jest
                    .spyOn(scopePrototype, "createChildScope");

                let asyncResolvePromise = Promise.resolve(undefined as any);

                const resolveAsyncFromScope = scopePrototype.resolveAsync;

                jest
                    .spyOn(scopePrototype, "resolveAsync")
                    .mockImplementation
                    (
                        function (this: any, ...args)
                        {
                            asyncResolvePromise = resolveAsyncFromScope.apply(this, args);

                            return asyncResolvePromise;
                        }
                    );

                const depedency1Spy = jest.fn();

                const { resolveAsync, resolutionKeys, asyncResolutionOptions } = createReactDiTools(scope);

                const Consumer = resolveAsync
                (
                    resolutionKeys("Key1"), 
                    asyncResolutionOptions({ createNewScope: true }),
                    ({ dependencies: [dependency1] }) =>
                    {
                        depedency1Spy(dependency1);

                        return (
                            <span data-testid={key1}>{dependency1.index}</span>
                        );
                    }
                );

                await act(async () => render(<Consumer />));

                expect(createChildScopeSpy).toHaveBeenCalledTimes(1);
                expect(depedency1Spy).not.toHaveBeenCalledWith(rootDependency1);

                const dependency1 = screen.queryByTestId(key1);

                expect(dependency1).toBeInTheDocument();
                expect(dependency1).toHaveTextContent(String(rootDependency1.index + 1));
            }
        );
    }
);
