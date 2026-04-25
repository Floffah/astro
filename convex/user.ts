import { UserJSON } from "@clerk/backend";
import { Validator, v } from "convex/values";

import { internalMutation, query } from "@/convex/server";

import { getCurrentUser, userByClerkId } from "./lib/auth";

export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUser(ctx);
        if (!user) return null;
        return user;
    },
});

export const upsertFromClerk = internalMutation({
    args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
    async handler(ctx, { data }) {
        const user = await userByClerkId(ctx, data.id);
        const newUserDoc = {
            name: data.username!,
            clerkId: data.id,
            imageUrl: data.image_url,
        };

        if (user === null) {
            await ctx.db.insert("users", newUserDoc);
        } else {
            await ctx.db.patch(user._id, newUserDoc);
        }
    },
});

export const deleteFromClerk = internalMutation({
    args: { clerkUserId: v.string() },
    async handler(ctx, { clerkUserId }) {
        const user = await userByClerkId(ctx, clerkUserId);

        if (user !== null) {
            await ctx.db.delete(user._id);
        } else {
            console.warn(
                `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
            );
        }
    },
});
