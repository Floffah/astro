import Link from "next/link";
import { redirect } from "next/navigation";

import {
    openBillingPortal,
    redirectToStripeMonthly,
    redirectToStripeYearly,
    redirectToStripeYearlyWithTrial,
} from "@/app/(nav_layout)/upgrade/actions";
import { Button } from "@/components/Button";
import { PoweredByStripe } from "@/components/blocks/PoweredByStripe";
import { FeatureFlag } from "@/lib/analytics/FeatureFlag";
import { getPostHogNodeClient } from "@/lib/analytics/nodeClient";
import { getSessionFromRuntime } from "@/lib/data/getSession";

export default async function UpgradePage() {
    const { user } = await getSessionFromRuntime();

    if (!user) {
        redirect("/");
        return;
    }

    if (user.premium) {
        return (
            <main className="flex max-w-xl flex-col gap-2">
                <p className="text-center text-xl font-semibold text-white">
                    You already have premium!
                </p>

                <p className="text-center text-white">
                    You can cancel it below
                </p>

                <Button size="sm" color="secondary" onClick={openBillingPortal}>
                    Open billing portal
                </Button>
            </main>
        );
    }

    const posthog = getPostHogNodeClient();

    const canSubscribe = await posthog.isFeatureEnabled(
        FeatureFlag.ALLOW_PREMIUM_SUBSCRIBE,
        user.publicId,
    );

    if (canSubscribe) {
        return (
            <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
                <p className="mx-auto max-w-lg text-xl text-white">
                    You are not allowed to subscribe to premium. Possible
                    reasons:
                </p>

                <ul className="mx-auto max-w-lg list-disc text-white">
                    <li>
                        You aren&apos;t in a supported country. Currently: UK
                    </li>
                    <li>
                        This feature hasn&apost been rolled out to all users yet
                    </li>
                </ul>

                <Button size="md" color="primary" asChild>
                    <Link href="/">Go home</Link>
                </Button>
            </main>
        );
    }

    return (
        <main className="flex max-w-md flex-col items-center gap-4 p-4">
            <p className="text-center text-xl text-white">
                Choose a billing option, you will be redirected to the checkout
            </p>

            <div className="flex flex-col items-center gap-4">
                {user.trialAvailable && (
                    <button
                        className="cursor-pointer rounded-lg border border-gray-800 p-2 transition-transform hover:scale-105"
                        onClick={redirectToStripeYearlyWithTrial}
                    >
                        <p className="text-xl font-bold text-white">
                            Free trial available
                        </p>

                        <p className="text-sm text-gray-300">
                            30 days free then £50 billed yearly
                        </p>
                    </button>
                )}

                <div className="flex gap-4">
                    <button
                        className="cursor-pointer rounded-lg border border-gray-800 p-2 transition-transform hover:scale-105"
                        onClick={redirectToStripeMonthly}
                    >
                        <p className="text-white">Monthly</p>
                        <p className="text-2xl font-bold text-white">£5</p>
                        <p className="text-sm text-gray-300">
                            (£5 Billed Monthly)
                        </p>
                    </button>
                    <button
                        className="cursor-pointer rounded-lg border border-gray-700 p-2 transition-transform hover:scale-105"
                        onClick={redirectToStripeYearly}
                    >
                        <p className="text-white">Yearly</p>
                        <p className="text-2xl font-bold text-white">£4.17</p>
                        <p className="text-sm text-gray-300">
                            (£50 Billed Yearly)
                        </p>
                    </button>
                </div>

                <Link
                    href="https://stripe.com"
                    className="transition-transform hover:scale-105"
                >
                    <PoweredByStripe className="h-10" />
                </Link>
            </div>
        </main>
    );
}
