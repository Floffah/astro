import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { db, users } from "@/db";
import { EventName } from "@/lib/analytics/EventName";
import { getPostHogNodeClient } from "@/lib/analytics/nodeClient";
import { getStripe } from "@/lib/stripe";

export const POST = async (req: NextRequest) => {
    const posthog = getPostHogNodeClient();
    const body = await req.bytes();
    const signature = req.headers.get("Stripe-Signature");

    const stripe = getStripe();

    let event: Stripe.Event;

    try {
        event = await stripe.webhooks.constructEventAsync(
            Buffer.from(body),
            signature!,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (e) {
        posthog.captureException(e);
        return new NextResponse("Webhook Error", { status: 400 });
    }

    if (
        event.type === "customer.subscription.created" ||
        event.type === "customer.subscription.updated" ||
        event.type === "customer.subscription.deleted"
    ) {
        if (
            event.data.object.status === "active" ||
            event.data.object.status === "trialing"
        ) {
            let customer = event.data.object.customer;

            if (typeof customer === "string") {
                customer = await stripe.customers.retrieve(customer);
            }

            if (!customer || customer.deleted || !customer.email) {
                return;
            }

            const user = await db.query.users.findFirst({
                where: (users, { eq }) => eq(users.email, customer.email!),
            });

            if (event.data.object.canceled_at) {
                if (user) {
                    posthog.capture({
                        distinctId: user.publicId,
                        event: EventName.SUBSCRIPTION_CANCELLED,
                    });

                    posthog.capture({
                        distinctId: user.publicId,
                        event: "$set",
                        properties: {
                            $set: {
                                cancelled_subscription: true,
                            },
                        },
                    });
                }
            } else {
                await db
                    .update(users)
                    .set({
                        premium: true,
                        trialAvailable: false,
                    })
                    .where(eq(users.email, customer.email!));

                if (user) {
                    posthog.capture({
                        distinctId: user.publicId,
                        event: EventName.SUBSCRIPTION_CREATED,
                    });

                    posthog.capture({
                        distinctId: user.publicId,
                        event: "$set",
                        properties: {
                            $set: {
                                premium: true,
                                trial_available: false,
                                cancelled_subscription: false,
                            },
                        },
                    });
                }
            }
        } else if (event.data.object.status === "canceled") {
            let customer = event.data.object.customer;

            if (typeof customer === "string") {
                customer = await stripe.customers.retrieve(customer);
            }

            if (!customer || customer.deleted || !customer.email) {
                return;
            }

            await db
                .update(users)
                .set({
                    premium: false,
                })
                .where(eq(users.email, customer.email!));

            const user = await db.query.users.findFirst({
                where: (users, { eq }) => eq(users.email, customer.email!),
            });

            if (user) {
                posthog.capture({
                    distinctId: user.publicId,
                    event: EventName.SUBSCRIPTION_ENDED,
                });

                posthog.capture({
                    distinctId: user.publicId,
                    event: "$set",
                    properties: {
                        $set: {
                            premium: false,
                        },
                    },
                });
            }
        }
    }

    return new NextResponse("ok");
};
