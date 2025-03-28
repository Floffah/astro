"use server";

import { Button } from "@/components/Button";
import { getSessionFromRuntime } from "@/lib/data/getSession";

export async function ManageSubscriptionButton() {
    const { user } = await getSessionFromRuntime();

    if (!user) {
        return null;
    }

    return (
        <Button size="sm" color="secondary" link="/upgrade" asChild>
            My Subscription
        </Button>
    );
}
