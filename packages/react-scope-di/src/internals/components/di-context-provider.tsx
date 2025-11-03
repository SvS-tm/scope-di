import type { Context, ProviderProps } from "react";

export type ContextProviderProps<T_Value> = 
(
    ProviderProps<T_Value>
        &
    {
        context: Context<T_Value>;
    }
);

/**
 * This is HOC for rendering in React's context
 */
export function DiContextProvider<T_Value extends unknown>({ context, value, children }: ContextProviderProps<T_Value>)
{
    const Provider = context.Provider === context
        /**
         * @note React 19+
         */
        ? context
        /**
         * @note React 18, legacy Provider usage
         */
        : context.Provider;

    return (
        <Provider value={value}>
            {children}
        </Provider>
    );
};
