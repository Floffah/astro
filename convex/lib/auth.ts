import { createClerkClient } from "@clerk/backend";

import { QueryCtx } from "@/convex/server";

import { env } from "../convex.env";

export const convexClerk = createClerkClient({
    secretKey: env.CLERK_SECRET_KEY,
});

export async function userByClerkId(ctx: QueryCtx, clerkId: string) {
    return await ctx.db
        .query("users")
        .withIndex("byClerkId", (q) => q.eq("clerkId", clerkId))
        .unique();
}

export async function ensureUser(ctx: QueryCtx) {
    return getCurrentUserOrThrow(ctx);
}

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
    const userRecord = await getCurrentUser(ctx);
    if (!userRecord) throw new Error("Can't get current user");
    return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
        return null;
    }
    return await userByClerkId(ctx, identity.subject);
}
