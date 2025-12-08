// deno-lint-ignore-file no-sloppy-imports
import "reflect-metadata";
import { container, DependencyContainer, Lifecycle } from "tsyringe";
import type { k_state } from "mitata";

function createIsolatedContainer(): DependencyContainer 
{
    return container.createChildContainer();
}

export function* registrationClass(state: k_state) 
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () => 
    {
        const isolatedContainer = createIsolatedContainer();

        for (let index = 0; index < iterations; ++index) 
        {
            isolatedContainer.register(keys[index], { useClass: class {} }, { lifecycle: Lifecycle.Singleton });
        }
    };
}

export function* registrationValue(state: k_state) 
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () => 
    {
        const isolatedContainer = createIsolatedContainer();

        for (let index = 0; index < iterations; ++index) 
        {
            isolatedContainer.register(keys[index], { useValue: {} });
        }
    };
}

export function* registrationFactory(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () => 
    {
        const isolatedContainer = createIsolatedContainer();

        for (let index = 0; index < iterations; ++index) 
        {
            isolatedContainer.register(keys[index], { useFactory: () => ({}) });
        }
    };
}
