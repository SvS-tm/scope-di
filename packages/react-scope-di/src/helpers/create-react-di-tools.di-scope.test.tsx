import { describe, expect, it, jest } from "@jest/globals";
import { configureRootScope, DependencyLifetime } from "@svs-tm/scope-di";
import { render, screen } from "@testing-library/react";
import { createReactDiTools } from "./create-react-di-tools";

describe
(
    "DiScope: Context & scope creation",
    () =>
    {
        it
        (
            "Provides scope via context: a child that resolves a simple value key can access the scope",
            () =>
            {
                const key = "Key";
                const value = {
                    id: "id"
                };

                const scope = configureRootScope()
                    .map(key)
                    .asValue(value)
                    .build();

                const { DiScope, useDependencies } = createReactDiTools(scope);

                const Consumer = () =>
                {
                    const [dependency] = useDependencies(key);

                    return <span data-testid={key}>{dependency.id}</span>;
                };

                render
                (
                    <DiScope>
                        <Consumer />
                    </DiScope>
                );

                const element = screen.queryByTestId(key);

                expect(element).toBeInTheDocument();
                expect(element).toHaveTextContent(value.id);
            }
        );

        it
        (
            "Creates a child scope: on mount, instances with Scoped lifetime are unique per <DiScope>; not the root instance",
            () =>
            {
                const key = "Key";
                let counter = 0;

                const scope = configureRootScope()
                    .map(key)
                    .asFactory(() => ({ value: ++counter }), DependencyLifetime.Scoped)
                    .build();

                const { DiScope, useDependencies } = createReactDiTools(scope);

                const Consumer = () =>
                {
                    const [dependency] = useDependencies(key);

                    return <span data-testid={key}>{dependency.value}</span>;
                };

                render
                (
                    <>
                        <DiScope>
                            <Consumer />
                        </DiScope>
                        <DiScope>
                            <Consumer />
                        </DiScope>
                    </>
                );

                const items = screen.queryAllByTestId(key);

                expect(items.map(item => item.textContent)).toStrictEqual(["1", "2"]);
            }
        );

        it
        (
            "Stable across re-renders: re-rendering the same <DiScope> does not create another child scope",
            () =>
            {
                const key = "Key";
                let counter = 0;

                const mockFactory = jest.fn(() => ({ value: ++counter }));

                const scope = configureRootScope()
                    .map(key)
                    .asFactory(mockFactory, DependencyLifetime.Scoped)
                    .build();

                const { DiScope, useDependencies } = createReactDiTools(scope);

                const Consumer = () =>
                {
                    const [dependency] = useDependencies(key);

                    return <span data-testid={key}>{dependency.value}</span>;
                };

                const { rerender } = render
                (
                    <DiScope>
                        <Consumer />
                    </DiScope>
                );

                const before = screen.getByTestId(key);
                expect(before).toHaveTextContent("1");

                rerender
                (
                    <DiScope>
                        <Consumer />
                    </DiScope>
                );

                const after = screen.getByTestId(key);
                
                expect(after).toHaveTextContent("1");
                expect(mockFactory).toHaveBeenCalledTimes(1);
                expect(before).toBe(after);
            }
        );
    }
);

describe
(
    "DiScope: Nesting & lifetimes",
    () =>
    {
        it
        (
            "Singletons: same instance across all <DiScope> mounts that share the same root scope",
            () =>
            {
                const key = "Key";
                let counter = 0;

                const scope = configureRootScope()
                    .map(key)
                    .asFactory(() => ({ value: ++counter }), DependencyLifetime.Singleton)
                    .build();

                const { DiScope, useDependencies } = createReactDiTools(scope);

                const Consumer = () =>
                {
                    const [dependency] = useDependencies(key);

                    return <span data-testid={key}>{dependency.value}</span>;
                };

                render
                (
                    <>
                        <DiScope>
                            <Consumer />
                            <DiScope>
                                <Consumer />
                            </DiScope>
                        </DiScope>
                        <DiScope>
                            <Consumer />
                        </DiScope>
                    </>
                );

                const items = screen.queryAllByTestId(key);

                expect(items.map(item => item.textContent)).toStrictEqual(["1", "1", "1"]);
            }
        );

        it
        (
            "Scoped: a child <DiScope> doesn't leak scoped instances into siblings",
            () =>
            {
                const key = "Key";
                let counter = 0;

                const scope = configureRootScope()
                    .map(key)
                    .asFactory(() => ({ value: ++counter }), DependencyLifetime.Scoped)
                    .build();

                const { DiScope, useDependencies } = createReactDiTools(scope);

                const Consumer = () =>
                {
                    const [dependency] = useDependencies(key);

                    return <span data-testid={key}>{dependency.value}</span>;
                };

                render
                (
                    <DiScope>
                        <Consumer />
                        <DiScope>
                            <Consumer />
                        </DiScope>
                    </DiScope>
                );

                const items = screen.queryAllByTestId(key);

                expect(items.map(item => item.textContent)).toStrictEqual(["1", "2"]);
            }
        );

        it
        (
            "ScopedInherited: instance first resolved in an ancestor is reused along that branch; different across other branches",
            () =>
            {
                const key = "Key";
                let counter = 0;

                const scope = configureRootScope()
                    .map(key)
                    .asFactory(() => ({ value: ++counter }), DependencyLifetime.ScopedInherited)
                    .build();

                const { DiScope, useDependencies } = createReactDiTools(scope);

                const Consumer = () =>
                {
                    const [dependency] = useDependencies(key);

                    return <span data-testid={key}>{dependency.value}</span>;
                };

                render
                (
                    <>
                        <DiScope>
                            <Consumer />
                            <DiScope>
                                <Consumer />
                                <DiScope>
                                    <Consumer />
                                </DiScope>
                            </DiScope>
                        </DiScope>
                        <DiScope>
                            <Consumer />
                        </DiScope>
                    </>
                );

                const items = screen.queryAllByTestId(key);

                expect(items.map(item => item.textContent)).toStrictEqual(["1", "1", "1", "2"]);
            }
        );

        it
        (
            "Transient: created new instance on every resolution",
            () =>
            {
                const key = "Key";
                let counter = 0;

                const scope = configureRootScope()
                    .map(key)
                    .asFactory(() => ({ value: ++counter }), DependencyLifetime.Transient)
                    .build();

                const { DiScope, useDependencies } = createReactDiTools(scope);

                const Consumer = () =>
                {
                    const [dependency] = useDependencies(key);

                    return <span data-testid={key}>{dependency.value}</span>;
                };

                render
                (
                    <>
                        <DiScope>
                            <Consumer />
                            <DiScope>
                                <Consumer />
                                <DiScope>
                                    <Consumer />
                                </DiScope>
                            </DiScope>
                        </DiScope>
                        <DiScope>
                            <Consumer />
                        </DiScope>
                    </>
                );

                const items = screen.queryAllByTestId(key);

                expect(items.map(item => item.textContent)).toStrictEqual(["1", "2", "3", "4"]);
            }
        );
    }
);

describe
(
    "DiScope: Disposal",
    () =>
    {
        it
        (
            "Sync disposal: [Symbol.dispose] is called once for created scope",
            () =>
            {
                const key = "Key";

                const scope = configureRootScope()
                    .map(key)
                    .asFactory(() => ({ value: 1 }), DependencyLifetime.Singleton)
                    .build();
                
                const scopePrototype = Object.getPrototypeOf(scope) as typeof scope;

                const disposeSpy = jest
                    .spyOn(scopePrototype, Symbol.dispose);

                const { DiScope, useDependencies } = createReactDiTools(scope);

                const Consumer = () =>
                {
                    const [dependency] = useDependencies(key);

                    return <span data-testid={key}>{dependency.value}</span>;
                };

                const { unmount } = render
                (
                    <DiScope>
                        <Consumer />
                    </DiScope>
                );

                const element = screen.queryByTestId(key);

                expect(element).toBeInTheDocument();
                expect(element).toHaveTextContent("1");

                unmount();

                expect(element).not.toBeInTheDocument();
                expect(disposeSpy).toHaveBeenCalledTimes(1);
            }
        );

        it
        (
            "Sync disposal: [Symbol.dispose] is called once for created child scope only, and root scope is untouched",
            () =>
            {
                const key = "Key";

                const scope = configureRootScope()
                    .map(key)
                    .asFactory(() => ({ value: 1 }), DependencyLifetime.Singleton)
                    .build();

                const rootScopeDisposeSpy = jest
                    .spyOn(scope, Symbol.dispose);

                const scopePrototype = Object.getPrototypeOf(scope) as typeof scope;

                const disposeSpy = jest
                    .spyOn(scopePrototype, Symbol.dispose);

                const { DiScope, useDependencies } = createReactDiTools(scope);

                const Consumer = () =>
                {
                    const [dependency] = useDependencies(key);

                    return <span data-testid={key}>{dependency.value}</span>;
                };

                const { rerender } = render
                (
                    <DiScope>
                        <DiScope>
                            <Consumer />
                        </DiScope>
                    </DiScope>
                );

                const element = screen.queryByTestId(key);

                expect(element).toBeInTheDocument();
                expect(element).toHaveTextContent("1");

                rerender
                (
                    <DiScope>
                        <></>
                    </DiScope>
                );

                expect(element).not.toBeInTheDocument();
                expect(disposeSpy).toHaveBeenCalledTimes(1);
                expect(rootScopeDisposeSpy).not.toHaveBeenCalled();
            }
        );
    }
);
