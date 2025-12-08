// deno-lint-ignore-file no-sloppy-imports
import { configureRootScope, DependencyLifetime } from "@svs-tm/scope-di";
import { k_state } from "mitata";

export function *registrationClass(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () =>
    {
        const builder = configureRootScope();
    
        for(let index = 0; index < iterations; ++index)
        {
            builder.map(keys[index]).asClass(class {}, DependencyLifetime.Singleton);
        }
    
        builder.build();
    }
}

export function *registrationValue(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () =>
    {
        const builder = configureRootScope();
    
        for(let index = 0; index < iterations; ++index)
        {
            builder.map(keys[index]).asValue({});
        }
    
        builder.build();
    }
}

export function *registrationFactory(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () =>
    {
        const builder = configureRootScope();
    
        for(let index = 0; index < iterations; ++index)
        {
            builder.map(keys[index]).asFactory(() => ({}), DependencyLifetime.Singleton);
        }
    
        builder.build();
    }
}
