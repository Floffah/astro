import { Instrumentation } from "next";

import { getPostHogNodeClient } from "@/lib/analytics/nodeClient";

export const onRequestError: Instrumentation.onRequestError = async (
    err,
    request,
) => {
    const posthog = getPostHogNodeClient();

    let distinctId = null;
    if (request.headers.cookie) {
        const cookieString = request.headers.cookie;
        const postHogCookieMatch =
            !Array.isArray(cookieString) &&
            cookieString.match(/ph_phc_.*?_posthog=([^;]+)/);

        if (postHogCookieMatch && postHogCookieMatch[1]) {
            try {
                const decodedCookie = decodeURIComponent(postHogCookieMatch[1]);
                const postHogData = JSON.parse(decodedCookie);
                distinctId = postHogData.distinct_id;
            } catch (e) {
                console.error("Error parsing PostHog cookie:", e);
            }
        }
    }

    await posthog.captureException(err, distinctId || undefined);
};
