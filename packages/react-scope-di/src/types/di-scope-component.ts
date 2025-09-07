import { FC, PropsWithChildren } from "react";
import { FallbackOptions } from "./fallback-options";

export type DiScopeComponentProps = FallbackOptions;

export type DiScopeComponent = FC<PropsWithChildren<DiScopeComponentProps>>;

