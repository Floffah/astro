import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { ssrPrepass } from "@trpc/next/ssrPrepass";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

import { queryClientConfig } from "@/lib/api/reactQuery";
import { AppRouter } from "@/trpc/router";

export const api = createTRPCNext<AppRouter>({
    transformer: superjson,
    ssr: true,
    ssrPrepass,
    config: () => ({
        links: [
            loggerLink({
                enabled: (opts) =>
                    process.env.NODE_ENV === "development" ||
                    (opts.direction === "down" && opts.result instanceof Error),
                colorMode: "css",
            }),
            httpBatchLink({
                url: process.env.NEXT_PUBLIC_BASE_URL + "/api",
                transformer: superjson,
            }),
        ],
        queryClientConfig,
    }),
});

export type TRPCInputTypes = inferRouterInputs<AppRouter>;
export type TRPCOutputTypes = inferRouterOutputs<AppRouter>;
