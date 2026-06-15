import { ComponentType } from "react";

export function getComponentDisplayName(component: ComponentType<any>, fallback: string)
{
    return component.displayName
        ?? component.name
        ?? fallback;
}
