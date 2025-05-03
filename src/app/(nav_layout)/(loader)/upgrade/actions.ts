"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";

import { getSessionFromRuntime } from "@/lib/data/getSession";
import { getStripe } from "@/lib/stripe";

async function redirectToStripe(
    plan: "plus_yearly" | "plus_monthly",
    trial: boolean,
) {
    const { user } = await getSessionFromRuntime();
    if (!user || user.premium) {
        return;
    }

    if (trial && !user.trialAvailable) {
        return;
    }

    const stripe = getStripe();

    const existingCustomers = await stripe.customers.search({
        query: 'email:"' + user.email + '"',
        limit: 1,
    });

    let customer: Stripe.Customer | null = null;

    if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        success_url: process.env.NEXT_PUBLIC_BASE_URL + "/upgrade/success",
        cancel_url: process.env.NEXT_PUBLIC_BASE_URL + "/home",
        line_items: [
            {
                price: plan,
                quantity: 1,
            },
        ],
        mode: "subscription",
        client_reference_id: user.publicId,
        customer_email: !customer ? user.email : undefined,
        customer: customer?.id ?? undefined,
        subscription_data: trial
            ? {
                  trial_period_days: 30,
                  trial_settings: {
                      end_behavior: {
                          missing_payment_method: "cancel",
                      },
                  },
              }
            : undefined,
    });

    if (checkoutSession.url) {
        redirect(checkoutSession.url);
    }
}

export async function redirectToStripeMonthly() {
    return redirectToStripe("plus_monthly", false);
}

export async function redirectToStripeYearly() {
    return redirectToStripe("plus_yearly", false);
}

export async function redirectToStripeYearlyWithTrial() {
    return redirectToStripe("plus_yearly", true);
}

export async function openBillingPortal() {
    "use server";

    const { user } = await getSessionFromRuntime();

    if (!user) {
        redirect("/");
        return;
    }

    const stripe = getStripe();

    const customerList = await stripe.customers.search({
        query: `email:"${user.email}"`,
        limit: 1,
    });

    const customer = customerList.data[0];

    const customerSession = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: process.env.NEXT_PUBLIC_BASE_URL + "/upgrade",
    });

    if (customerSession.url) {
        redirect(customerSession.url);
    }
}
