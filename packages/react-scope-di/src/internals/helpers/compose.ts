import { isSafeReference } from "@svs-tm/system";

export const compose = <T_Object extends { [key: string]: unknown; }>(...objects: (T_Object | undefined)[]) : T_Object | undefined =>
{
    let result: T_Object | undefined = undefined;

    for (const current of objects)
    {
        if (!isSafeReference(current))
            continue;

        for(const key in current)
            (result ??= {} as T_Object)[key] ??= current[key];
    }

    return result;
};
