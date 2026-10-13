// deno-lint-ignore-file no-sloppy-imports

/** Every descriptor uses one factory whose results cycle through six shapes. */
export function createChangingShapeFactory()
{
    let index = 0;

    return () =>
    {
        const shape = index;
        index = (index + 1) % 6;

        // Equal field counts keep allocation sizes comparable; no result is disposable.
        switch (shape)
        {
            case 0: return { a: 1, b: 2 };
            case 1: return { c: 1, d: 2 };
            case 2: return { e: 1, f: 2 };
            case 3: return { g: 1, h: 2 };
            case 4: return { i: 1, j: 2 };
            default: return { k: 1, l: 2 };
        }
    };
}
