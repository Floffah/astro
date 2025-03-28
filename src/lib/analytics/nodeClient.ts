import { PostHog } from "posthog-node";
import { cache } from "react";

export const getPostHogNodeClient = cache(
    () =>
        new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
            host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
            flushAt: 1,
            flushInterval: 0,
        }),
);
