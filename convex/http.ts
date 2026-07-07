import type { WebhookEvent } from "@clerk/backend";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";

import { internal } from "@/convex/api";
import { httpAction } from "@/convex/server";

import { env } from "./convex.env";

const http = httpRouter();

http.route({
    path: "/clerk-users-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const event = await validateRequest(request);
        if (!event) {
            return new Response("Invalid Clerk webhook", { status: 400 });
        }
        switch (event.type) {
            case "user.created": // intentional fallthrough
            case "user.updated":
                await ctx.runMutation(internal.user.upsertFromClerk, {
                    data: event.data,
                });
                break;

            case "user.deleted": {
                const clerkUserId = event.data.id!;
                await ctx.runMutation(internal.user.deleteFromClerk, {
                    clerkUserId,
                });
                break;
            }
            default:
                console.log("Ignored Clerk webhook event", event.type);
        }

        return new Response(null, { status: 200 });
    }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
    const payloadString = await req.text();
    const svixHeaders = {
        "svix-id": req.headers.get("svix-id")!,
        "svix-timestamp": req.headers.get("svix-timestamp")!,
        "svix-signature": req.headers.get("svix-signature")!,
    };
    const wh = new Webhook(env.CLERK_USERS_WEBHOOK_SIGNING_SECRET);
    try {
        return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
    } catch (error) {
        console.error("Error verifying webhook event", error);
        return null;
    }
}

export default http;
