import { Suspense, type SuspenseProps } from "react";
import type { ResolutionPendingFallback } from "../../types";
import { DiFallback } from "./di-fallback";

export type DiSuspenseProps =
(
    Omit<SuspenseProps, "fallback">
        &
    {
        fallback: ResolutionPendingFallback;
    }
);

const empty = {};

export function DiSuspense({ fallback, ...rest }: DiSuspenseProps)
{
    return (
        <Suspense 
            {...rest} 
            fallback={<DiFallback element={fallback} props={empty} />} 
        />
    );
};
