export namespace Logging
{
    const prefix = "[scope-di]";

    export function warning(message: string, ...parameters: unknown[])
    {
        console.warn(`${prefix} ${message}`, ...parameters);
    }

    export function info(message: string, ...parameters: unknown[])
    {
        console.info(`${prefix} ${message}`, ...parameters);
    }

    export function error(message: string, ...parameters: unknown[])
    {
        console.error(`${prefix} ${message}`, ...parameters);
    }
}
