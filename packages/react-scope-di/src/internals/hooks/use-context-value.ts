import { isSafeReference } from "@svs-tm/system";
import React, { Context, useContext } from "react";

export const useContextValue = <T_Value>(context: Context<T_Value>) =>
{
    const use = React.use;

    if (isSafeReference(use))
        return use(context);

    return useContext(context);
};
