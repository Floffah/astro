"use client";

import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";

import { EventName } from "@/lib/analytics/EventName";
import { api } from "@/lib/api";

export function LogoutButton() {
    const trpc = api.useUtils();
    const posthog = usePostHog();
    const router = useRouter();

    const logoutMutation = api.authentication.logout.useMutation();

    return (
        <button
            onClick={async () => {
                router.prefetch("/");

                posthog.capture(EventName.LOGOUT);
                posthog.reset();

                await logoutMutation.mutateAsync();
                await trpc.user.me.invalidate();

                router.push("/");
            }}
            className="cursor-pointer font-semibold text-white"
        >
            Logout
        </button>
    );
}
