// deno-lint-ignore-file no-sloppy-imports
import "reflect-metadata";
import { Container } from "typedi";
import type { k_state } from "mitata";

let containerIndex = 0;

function createIsolatedContainer()
{
    return Container.of(`benchmark-${containerIndex++}`);
}

export function *registrationClass(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () =>
    {
        const container = createIsolatedContainer();

        for (let index = 0; index < iterations; ++index)
        {
            container.set({ id: keys[index], type: class {} });
        }
    };
}

export function *registrationValue(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () =>
    {
        const container = createIsolatedContainer();

        for (let index = 0; index < iterations; ++index)
        {
            container.set(keys[index], {});
        }
    };
}

export function *registrationFactory(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () =>
    {
        const container = createIsolatedContainer();

        for (let index = 0; index < iterations; ++index)
        {
            container.set({ id: keys[index], factory: () => ({}) });
        }
    };
}
