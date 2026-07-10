import { configureRootScope, DependencyLifetime } from "@svs-tm/scope-di";
import type { ReactElement } from "react";
import { expect } from "tstyche";
import { createReactDiTools } from ".";

class Dependency
{
    public readonly dependency = true;
}

type DependencyAbstraction =
{
    readonly dependency: boolean;
};

type ConsumerProps =
{
    readonly id: string;
};

const scope = configureRootScope()
    .map("value").asValue("value")
    .map("dependency").asClass<DependencyAbstraction>(Dependency, DependencyLifetime.Singleton)
    .map("asyncDependency").asFactoryAsync(async () => ({ value: "async" }), DependencyLifetime.Singleton)
    .map("items").asValue("first")
    .map("items").asValue(2)
    .build();

const tools = createReactDiTools(scope);

// Hook dependency tuples preserve exact key order and abstraction types.
function UseDependenciesConsumer()
{
    const dependencies = tools.useDependencies("value", "dependency", ["items"]);

    expect(dependencies).type.not.toBe<any>();
    expect(dependencies).type.toBe<["value", DependencyAbstraction, [2, "first"]]>();

    return null;
}

expect(<UseDependenciesConsumer />).type.toBeAssignableTo<ReactElement>();

// Async hook results stay promise-like, and awaited tuples preserve awaited dependency types.
function UseDependenciesAsyncConsumer()
{
    const result = tools.useDependenciesAsync("value", "asyncDependency", ["items"]);

    expect(result).type.not.toBe<any>();
    expect(null as unknown as Awaited<typeof result>).type.not.toBe<any>();
    expect(result).type.toBeAssignableTo<Promise<["value", { readonly value: "async"; }, [2, "first"]]>>();
    expect(null as unknown as Awaited<typeof result>).type.toBe<["value", { readonly value: "async"; }, [2, "first"]]>();

    return (
        <tools.DiAwait result={result}>
        {
            (dependencies) =>
            {
                expect(dependencies).type.toBe<["value", { readonly value: "async"; }, [2, "first"]]>();

                return null;
            }
        }
        </tools.DiAwait>
    );
}

expect(<UseDependenciesAsyncConsumer />).type.toBeAssignableTo<ReactElement>();

// resolve() injects dependency tuples while preserving the public component props.
const ResolvedConsumer = tools.resolve
(
    ["value", "dependency"],
    tools.resolutionOptions<ConsumerProps>(),
    ({ props, dependencies }) =>
    {
        expect(props).type.toBe<ConsumerProps>();
        expect(dependencies).type.toBe<["value", DependencyAbstraction]>();

        return null;
    }
);

expect(<ResolvedConsumer id="consumer" />).type.toBeAssignableTo<ReactElement>();
// @ts-expect-error
<ResolvedConsumer />;
// @ts-expect-error
<ResolvedConsumer id="consumer" extra="extra" />;

// resolveAsync() injects awaited dependency tuples and preserves component props.
const ResolvedAsyncConsumer = tools.resolveAsync
(
    ["asyncDependency", ["items"]],
    tools.asyncResolutionOptions<ConsumerProps>(),
    ({ props, dependencies }) =>
    {
        expect(props).type.toBe<ConsumerProps>();
        expect(dependencies).type.toBe<[{ readonly value: "async"; }, [2, "first"]]>();

        return null;
    }
);

expect(<ResolvedAsyncConsumer id="consumer" />).type.toBeAssignableTo<ReactElement>();
// @ts-expect-error
<ResolvedAsyncConsumer />;

// Registered keys are enforced by hooks and HOCs.
// @ts-expect-error
tools.useDependencies("missing");
tools.resolve
(
    // @ts-expect-error
    ["missing"],
    tools.resolutionOptions<ConsumerProps>(),
    () => null
);
