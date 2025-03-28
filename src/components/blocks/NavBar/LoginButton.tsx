"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";

import { Button } from "@/components/Button";
import { EventName } from "@/lib/analytics/EventName";
import { api } from "@/lib/api";

export function LoginButton() {
    const trpc = api.useUtils();
    const posthog = usePostHog();
    const router = useRouter();

    const meQuery = api.user.me.useQuery();
    const logoutMutation = api.authentication.logout.useMutation();

    if (!meQuery.data) {
        return (
            <Button size="sm" color="primary" asChild>
                <Link href="/">Login</Link>
            </Button>
        );
    }

    return (
        <Button
            size="sm"
            color="secondary"
            onClick={async () => {
                router.prefetch("/");

                posthog.capture(EventName.LOGOUT);
                posthog.reset();

                await logoutMutation.mutateAsync();
                await trpc.user.me.invalidate();

                router.push("/");
            }}
        >
            Logout
        </Button>
    );
}
