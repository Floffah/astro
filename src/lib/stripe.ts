import { cache } from "react";
import Stripe from "stripe";

export const getStripe = cache(
    () => new Stripe(process.env.STRIPE_API_SECRET!),
);
