import Link from "next/link";
import { redirect } from "next/navigation";

import { openBillingPortal } from "@/app/(nav_layout)/upgrade/actions";
import { Button } from "@/components/Button";
import { getSessionFromRuntime } from "@/lib/data/getSession";
import { getStripe } from "@/lib/stripe";

export default async function UpgradeSuccessPage() {
    const { user } = await getSessionFromRuntime();

    if (!user) {
        redirect("/");
        return;
    }

    if (!user.premium) {
        const stripe = getStripe();

        const customerList = await stripe.customers.search({
            query: `email:"${user.email}"`,
            limit: 1,
        });

        return (
            <main className="flex max-w-xl flex-col gap-2">
                <p className="text-center text-xl font-semibold text-white">
                    We don&apos;t have a subscription for you yet.
                </p>

                <p className="text-center text-white">
                    Try refreshing in a few seconds, the systems may be running
                    slow.
                </p>

                <p className="mt-5 text-center text-lg text-white">
                    Still not working?
                </p>

                <ul className="mx-auto list-disc text-white">
                    <li>
                        <a
                            href="https://discord.gg/DsSeGSc5na"
                            target="_blank"
                            className="text-blue-500 hover:underline"
                        >
                            Open a ticket
                        </a>
                    </li>
                    {customerList.data?.length > 0 && (
                        <li>
                            <a
                                className="text-blue-500 hover:underline"
                                href="#"
                                onClick={openBillingPortal}
                            >
                                Open your billing portal
                            </a>
                        </li>
                    )}
                </ul>
            </main>
        );
    }

    return (
        <main className="flex max-w-lg flex-col gap-4">
            <h1 className="text-center text-3xl font-bold text-white">
                Thanks for subscribing!
            </h1>

            <p className="text-white">
                We hope you enjoy your perks. If you have any questions, feel
                free to reach out to us on{" "}
                <a
                    href="https://discord.gg/DsSeGSc5na"
                    target="_blank"
                    className="text-blue-500 hover:underline"
                >
                    Discord
                </a>
            </p>

            <div className="flex w-full gap-2">
                <Button
                    size="md"
                    color="secondary"
                    onClick={openBillingPortal}
                    className="basis-full"
                >
                    Open billing portal
                </Button>
                <Button
                    size="md"
                    color="primary"
                    className="basis-full"
                    asChild
                >
                    <Link href="/home">Go home</Link>
                </Button>
            </div>
        </main>
    );
}
