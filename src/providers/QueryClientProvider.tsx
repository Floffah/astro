"use client";

import {
    QueryClient,
    QueryClientProvider as RQProvider,
} from "@tanstack/react-query";
import { PropsWithChildren, useMemo } from "react";

export function QueryClientProvider({ children }: PropsWithChildren) {
    const client = useMemo(() => new QueryClient(), []);

    return <RQProvider client={client}>{children}</RQProvider>;
}
