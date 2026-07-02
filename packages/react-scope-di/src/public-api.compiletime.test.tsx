import { configureRootScope, DependencyLifetime } from "@svs-tm/scope-di";
import { expectAssignable, expectError, expectNotType, expectType } from "tsd";
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

    expectNotType<any>(dependencies);
    expectType<["value", DependencyAbstraction, [2, "first"]]>(dependencies);

    return null;
}

expectAssignable<JSX.Element>(<UseDependenciesConsumer />);

// Async hook results stay promise-like, and awaited tuples preserve awaited dependency types.
function UseDependenciesAsyncConsumer()
{
    const result = tools.useDependenciesAsync("value", "asyncDependency", ["items"]);

    expectNotType<any>(result);
    expectNotType<any>(null as unknown as Awaited<typeof result>);
    expectAssignable<Promise<["value", { readonly value: "async"; }, [2, "first"]]>>(result);
    expectType<["value", { readonly value: "async"; }, [2, "first"]]>(null as unknown as Awaited<typeof result>);

    return (
        <tools.DiAwait result={result}>
        {
            (dependencies) =>
            {
                expectType<["value", { readonly value: "async"; }, [2, "first"]]>(dependencies);

                return null;
            }
        }
        </tools.DiAwait>
    );
}

expectAssignable<JSX.Element>(<UseDependenciesAsyncConsumer />);

// resolve() injects dependency tuples while preserving the public component props.
const ResolvedConsumer = tools.resolve
(
    ["value", "dependency"],
    tools.resolutionOptions<ConsumerProps>(),
    ({ props, dependencies }) =>
    {
        expectType<ConsumerProps>(props);
        expectType<["value", DependencyAbstraction]>(dependencies);

        return null;
    }
);

expectAssignable<JSX.Element>(<ResolvedConsumer id="consumer" />);
expectError(<ResolvedConsumer />);
expectError(<ResolvedConsumer id="consumer" extra="extra" />);

// resolveAsync() injects awaited dependency tuples and preserves component props.
const ResolvedAsyncConsumer = tools.resolveAsync
(
    ["asyncDependency", ["items"]],
    tools.asyncResolutionOptions<ConsumerProps>(),
    ({ props, dependencies }) =>
    {
        expectType<ConsumerProps>(props);
        expectType<[{ readonly value: "async"; }, [2, "first"]]>(dependencies);

        return null;
    }
);

expectAssignable<JSX.Element>(<ResolvedAsyncConsumer id="consumer" />);
expectError(<ResolvedAsyncConsumer />);

// Registered keys are enforced by hooks and HOCs.
expectError(tools.useDependencies("missing"));
expectError
(
    tools.resolve
    (
        ["missing"],
        tools.resolutionOptions<ConsumerProps>(),
        () => null
    )
);
