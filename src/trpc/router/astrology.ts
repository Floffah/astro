import { withTracing } from "@posthog/ai";
import { TRPCError } from "@trpc/server";
import { generateText } from "ai";
import { eq } from "drizzle-orm";
import type { PgUpdateSetSource } from "drizzle-orm/pg-core/query-builders/update";
import { after } from "next/server";
import { z } from "zod";

import { db, horoscopes, users } from "@/db";
import { deepseek } from "@/lib/ai/deepseek";
import {
    getHoroscopeSummaryPrompt,
    getSignSummaryPrompt,
} from "@/lib/ai/prompts";
import { getPostHogNodeClient } from "@/lib/analytics/nodeClient";
import { getDailyTransits } from "@/lib/astrology/getDailyTransits";
import { UserError } from "@/lib/errors/UserError";
import { authedProcedure, router } from "@/trpc/trpc";

export const astrologyRouter = router({
    getSignSummary: authedProcedure
        .input(
            z.object({
                sign: z.union([
                    z.literal("sun"),
                    z.literal("moon"),
                    z.literal("ascendant"),
                ]),
            }),
        )
        .query(async ({ ctx, input }) => {
            if (input.sign === "sun" && ctx.user.sunSignSummary) {
                return ctx.user.sunSignSummary;
            } else if (input.sign === "moon" && ctx.user.moonSignSummary) {
                return ctx.user.moonSignSummary;
            } else if (
                input.sign === "ascendant" &&
                ctx.user.ascendantSignSummary
            ) {
                return ctx.user.ascendantSignSummary;
            }

            if (!ctx.user.onboarded || !ctx.user.cachedNatalPlanetPositions) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: UserError.NOT_ONBOARDED,
                });
            }

            const initialUpdateValues: PgUpdateSetSource<typeof users> = {};

            const pendingMessage =
                "Your summary is still generating. Check back in about a minute. (You may need to refresh)";
            if (input.sign === "sun") {
                initialUpdateValues.sunSignSummary = pendingMessage;
            } else if (input.sign === "moon") {
                initialUpdateValues.moonSignSummary = pendingMessage;
            } else if (input.sign === "ascendant") {
                initialUpdateValues.ascendantSignSummary = pendingMessage;
            }

            await db
                .update(users)
                .set(initialUpdateValues)
                .where(eq(users.id, ctx.user.id));

            const prompt = getSignSummaryPrompt(input.sign, ctx.user);

            const posthog = getPostHogNodeClient();

            const { text } = await generateText({
                model: withTracing(deepseek("deepseek-chat"), posthog, {
                    posthogDistinctId: ctx.user.publicId,
                    posthogProperties: {
                        type: "user_sign_summary",
                        sign: input.sign,
                    },
                }),
                ...prompt,
                temperature: 1.0,
            });

            await posthog.shutdown();

            const summaryUpdateValues: PgUpdateSetSource<typeof users> = {};

            if (input.sign === "sun") {
                summaryUpdateValues.sunSignSummary = text;
            } else if (input.sign === "moon") {
                summaryUpdateValues.moonSignSummary = text;
            } else if (input.sign === "ascendant") {
                summaryUpdateValues.ascendantSignSummary = text;
            }

            after(async () => {
                await db
                    .update(users)
                    .set(summaryUpdateValues)
                    .where(eq(users.id, ctx.user.id));
            });

            return text;
        }),

    getHoroscopeForDay: authedProcedure
        .input(
            z.object({
                date: z.date(),
            }),
        )
        .query(async ({ ctx, input }) => {
            if (!ctx.user || !ctx.user.onboarded) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: UserError.NOT_ONBOARDED,
                });
            }

            const currentDate = new Date();

            if (!ctx.user.premium) {
                if (
                    currentDate.getUTCFullYear() !==
                        input.date.getUTCFullYear() ||
                    currentDate.getUTCMonth() !== input.date.getUTCMonth() ||
                    currentDate.getUTCDate() !== input.date.getUTCDate()
                ) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: UserError.NOT_PREMIUM,
                    });
                }
            }

            let existingHoroscope = await db.query.horoscopes.findFirst({
                where: (horoscopes, { eq, and }) =>
                    and(
                        eq(horoscopes.userId, ctx.user.id),
                        eq(horoscopes.date, input.date),
                    ),
            });

            if (existingHoroscope && existingHoroscope.summary) {
                return existingHoroscope.summary ?? null;
            }

            if (!existingHoroscope) {
                const insertResult = await db
                    .insert(horoscopes)
                    .values({
                        userId: ctx.user.id,
                        type: "daily",
                        date: input.date,
                        summary:
                            "Your summary is still generating. Check back in about a minute. (You may need to refresh)",
                    })
                    .returning();
                existingHoroscope = insertResult[0];
            }

            const transitChart = await getDailyTransits({
                birthDate: ctx.user.birthTimestamp!,
                birthLat: ctx.user.birthLatitude!,
                birthLong: ctx.user.birthLongitude!,
                transitDate: input.date,
                transitLat: ctx.user.birthLatitude!,
                transitLong: ctx.user.birthLongitude!,
            });

            const prompt = getHoroscopeSummaryPrompt(
                ctx.user,
                input.date,
                transitChart,
            );

            const posthog = getPostHogNodeClient();

            const { text: summary } = await generateText({
                model: withTracing(deepseek("deepseek-chat"), posthog, {
                    posthogDistinctId: ctx.user.publicId,
                    posthogProperties: {
                        type: "user_horoscope",
                        for_date: input.date.toISOString(),
                    },
                }),
                ...prompt,
                temperature: 1.0,
            });

            await posthog.shutdown();

            await db
                .update(horoscopes)
                .set({
                    summary,
                })
                .where(eq(horoscopes.id, existingHoroscope.id));

            return summary;
        }),
});
