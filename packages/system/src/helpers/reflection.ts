export namespace Reflection
{
    export type RuntimeSelector<T_Target, T_Member = any> = (target: T_Target) => T_Member;

    export function runtimeAccessesOf<T_Target, T_Member = any>(selector: RuntimeSelector<T_Target, T_Member>): string[]
    {
        const path: string[] = [];

        const pathProxy: string[] = new Proxy
        (
            path, 
            {
                get: (target, key) =>
                {
                    target.push(key.toString());

                    return pathProxy;
                }
            }
        );

        selector(pathProxy as T_Target);

        return path;
    }

    export function runtimeNameOf<T_Target, T_Member = any>(selector: RuntimeSelector<T_Target, T_Member>): string
    {
        let name: string | null = null;

        const nameProxy = new Proxy
        (
            {}, 
            {
                get: (_target, key) =>
                {
                    name = key.toString();

                    return nameProxy;
                }
            }
        );

        selector(nameProxy as T_Target);

        if (name === null)
            throw new Error("Selector must access at least one member of the target!");

        return name;
    }
}
