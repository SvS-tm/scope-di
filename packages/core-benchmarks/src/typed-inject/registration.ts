// deno-lint-ignore-file no-sloppy-imports
import { createInjector, Scope } from "typed-inject";
import type { k_state } from "mitata";

export function *registrationClass(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () =>
    {
        let injector = createInjector();

        for (let index = 0; index < iterations; ++index)
        {
            injector = injector.provideClass(keys[index], class {}, Scope.Singleton);
        }
    };
}

export function *registrationValue(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () =>
    {
        let injector = createInjector();

        for (let index = 0; index < iterations; ++index)
        {
            injector = injector.provideValue(keys[index], {});
        }
    };
}

export function *registrationFactory(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () =>
    {
        let injector = createInjector();

        for (let index = 0; index < iterations; ++index)
        {
            injector = injector.provideFactory(keys[index], () => ({}), Scope.Singleton);
        }
    };
}
