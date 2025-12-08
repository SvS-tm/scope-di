// deno-lint-ignore-file no-sloppy-imports
import "reflect-metadata";
import { Container } from "inversify";
import type { k_state } from "mitata";

export function *registrationClass(state: k_state) 
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () => 
    {
        const container = new Container();

        for (let index = 0; index < iterations; index++) 
        {
            container.bind(keys[index]).to(class { }).inSingletonScope();
        }
    };
}

export function *registrationValue(state: k_state) 
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () => 
    {
        const container = new Container();

        for (let index = 0; index < iterations; ++index) 
        {
            container.bind(keys[index]).toConstantValue({});
        }
    };
}

export function *registrationFactory(state: k_state) 
{
    const iterations = state.get("iterations") as number;

    const keys = Array.from({ length: iterations }, (_, index) => `k${index}`);

    yield () => 
    {
        const container = new Container();

        for (let index = 0; index < iterations; ++index) 
        {
            container
                .bind(keys[index])
                .toDynamicValue(() => ({}))
                .inSingletonScope();
        }
    };
}
