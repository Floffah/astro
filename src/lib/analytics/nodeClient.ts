import { after } from "next/server";
import { PostHog } from "posthog-node";
import { cache } from "react";

export const getPostHogNodeClient = cache(() => {
    const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        flushAt: 1,
        flushInterval: 0,
    });

    try {
        after(async () => {
            await posthog.shutdown();
        });
    } catch {}

    return posthog;
});
