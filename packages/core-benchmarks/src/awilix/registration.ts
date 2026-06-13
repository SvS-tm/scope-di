// deno-lint-ignore-file no-sloppy-imports
import { asClass, asFunction, asValue, createContainer, Lifetime } from "awilix";
import type { k_state } from "mitata";

export function *registrationClass(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () =>
    {
        const container = createContainer();

        for (let index = 0; index < iterations; ++index)
        {
            container.register(keys[index], asClass(class {}, { lifetime: Lifetime.SINGLETON }));
        }
    };
}

export function *registrationValue(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () =>
    {
        const container = createContainer();

        for (let index = 0; index < iterations; ++index)
        {
            container.register(keys[index], asValue({}));
        }
    };
}

export function *registrationFactory(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () =>
    {
        const container = createContainer();

        for (let index = 0; index < iterations; ++index)
        {
            container.register(keys[index], asFunction(() => ({}), { lifetime: Lifetime.SINGLETON }));
        }
    };
}
