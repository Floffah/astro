"use client";

// app/providers.tsx
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { PropsWithChildren, Suspense, useEffect } from "react";

import { api } from "@/lib/api";

export function PostHogProvider({ children }: PropsWithChildren) {
    const meQuery = api.user.me.useQuery();

    useEffect(() => {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
            api_host: "/ingest",
            ui_host:
                process.env.NEXT_PUBLIC_POSTHOG_HOST ||
                "https://us.i.posthog.com",
            person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
            capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        });
    }, []);

    useEffect(() => {
        if (meQuery.data) {
            posthog.identify(meQuery.data.id, {
                email: meQuery.data.email,
            });
        }
    }, [meQuery.data]);

    return (
        <PHProvider client={posthog}>
            <SuspendedPostHogPageView />
            {children}
        </PHProvider>
    );
}

function PostHogPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const posthog = usePostHog();

    // Track pageviews
    useEffect(() => {
        if (pathname && posthog) {
            let url = window.origin + pathname;
            if (searchParams.toString()) {
                url = url + "?" + searchParams.toString();
            }

            posthog.capture("$pageview", { $current_url: url });
        }
    }, [pathname, searchParams, posthog]);

    return null;
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
    return (
        <Suspense fallback={null}>
            <PostHogPageView />
        </Suspense>
    );
}
