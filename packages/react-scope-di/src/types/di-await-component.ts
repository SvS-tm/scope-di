import { ReactNode, JSX } from "react";

export type DiAwaitProps<T_Value> = 
{
    promise: Promise<T_Value>;
    children: (awaited: T_Value) => ReactNode;
};

export type DiAwaitComponent = 
{
    <T_Value extends unknown>({ promise, children }: DiAwaitProps<T_Value>): JSX.Element;
};
