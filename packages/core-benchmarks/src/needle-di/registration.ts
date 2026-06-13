// deno-lint-ignore-file no-sloppy-imports
import { Container } from "@needle-di/core";
import type { k_state } from "mitata";

type ServiceConstructor = new () => object;

export function *registrationClass(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys: ServiceConstructor[] = Array.from({ length: iterations }, () => class {});

    yield () =>
    {
        const container = new Container();

        for (let index = 0; index < iterations; ++index)
        {
            container.bind({ provide: keys[index], useClass: class {} });
        }
    };
}

export function *registrationValue(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys: ServiceConstructor[] = Array.from({ length: iterations }, () => class {});

    yield () =>
    {
        const container = new Container();

        for (let index = 0; index < iterations; ++index)
        {
            container.bind({ provide: keys[index], useValue: {} });
        }
    };
}

export function *registrationFactory(state: k_state)
{
    const iterations = state.get("iterations") as number;

    const keys: ServiceConstructor[] = Array.from({ length: iterations }, () => class {});

    yield () =>
    {
        const container = new Container();

        for (let index = 0; index < iterations; ++index)
        {
            container.bind({ provide: keys[index], useFactory: () => ({}) });
        }
    };
}
