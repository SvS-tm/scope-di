import { Component, ErrorInfo, PropsWithChildren } from "react";
import { ResolutionErrorFallback } from "../../types";
import { DiFallback } from "./di-fallback";

export type DiErrorBoundaryProps = PropsWithChildren<{ fallback: ResolutionErrorFallback; }>;

type DiErrorBoundaryState = 
(
    {
        hasError: true;
        error: unknown;
    } 
        | 
    {
        hasError: false;
    }
);

export class DiErrorBoundary extends Component<DiErrorBoundaryProps, DiErrorBoundaryState>
{
    public override state: DiErrorBoundaryState = { hasError: false };

    public static getDerivedStateFromError(error: unknown): DiErrorBoundaryState
    {
        return { hasError: true, error };
    }

    public override componentDidCatch(error: unknown, errorInfo: ErrorInfo) 
    {
        console.error("Error:", error, errorInfo);
    }

    public override render()
    {
        if (this.state.hasError)
            return <DiFallback element={this.props.fallback} props={{ error: this.state.error }} />;

        return <>{this.props.children}</>;
    }
}
