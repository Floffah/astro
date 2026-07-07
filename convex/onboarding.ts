import { makeFunctionReference } from "convex/server";
import { Infer, v } from "convex/values";

import type { Doc } from "@/convex/dataModel";
import { action, internalMutation } from "@/convex/server";
import { astrocalc } from "@/lib/astrocalc";

const currentUserRef = makeFunctionReference<
    "query",
    never,
    Doc<"users"> | null
>("user:currentUser");

const storeNatalChartRef = makeFunctionReference<
    "mutation",
    Infer<typeof storeNatalChartArgs>,
    void
>("onboarding:storeNatalChart");

export const createNatalChart = action({
    args: {
        birthday: v.string(),
        latitude: v.number(),
        longitude: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(currentUserRef, {});

        if (!user) {
            throw new Error("You must be signed in to create a natal chart");
        }

        // if (user.birthChart) {
        //     return {
        //         status: "already_created",
        //         birthChart: user.birthChart,
        //     } as const;
        // }

        const birthDate = new Date(args.birthday);

        if (Number.isNaN(birthDate.getTime())) {
            throw new Error("Invalid birth date");
        }

        const response = await astrocalc.GET("/birth-chart", {
            params: {
                query: {
                    year: birthDate.getUTCFullYear(),
                    month: birthDate.getUTCMonth() + 1,
                    day: birthDate.getUTCDate(),
                    hour: birthDate.getUTCHours(),
                    minute: birthDate.getUTCMinutes(),
                    latitude: args.latitude,
                    longitude: args.longitude,
                },
            },
        });

        if (response.error) {
            console.log(response.error);
            throw new Error("Failed to calculate natal chart");
        }

        await ctx.runMutation(storeNatalChartRef, {
            userId: user._id,
            birthData: {
                birthday: args.birthday,
                latitude: args.latitude,
                longitude: args.longitude,
            },
            birthChart: response.data,
        });

        return {
            status: "created",
            birthChart: response.data,
        } as const;
    },
});

const storeNatalChartArgs = v.object({
    userId: v.id("users"),
    birthData: v.object({
        birthday: v.string(),
        latitude: v.number(),
        longitude: v.number(),
    }),
    birthChart: v.any(),
});

export const storeNatalChart = internalMutation({
    args: storeNatalChartArgs,
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, {
            birthData: args.birthData,
            birthChart: args.birthChart,
        });
    },
});
