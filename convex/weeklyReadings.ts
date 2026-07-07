import { makeFunctionReference } from "convex/server";
import { Infer, VAny, v } from "convex/values";

import type { Doc } from "@/convex/dataModel";
import { action, internalMutation } from "@/convex/server";
import {
    type WeeklyReadingDataset,
    curateWeeklyReadingDataset,
    fetchTransitRange,
} from "@/lib/weekly-transits";
import { SchemaCalculateTransitRangeResponse } from "@/types/apis/astrocalc";

import {
    type WeeklyReadingSection,
    weeklyReadingSectionValidator,
    weeklyReadingSections,
} from "./lib/weeklyReadingShared";
import { genWorkpool } from "./lib/workpools";

type WeeklyReadingErrors = NonNullable<Doc<"users">["weekReadingErrors"]>;
type GenerateWeeklyReadingSectionArgs = {
    userId: Doc<"users">["_id"];
    generationId: string;
    weekReadingKey: string;
    section: WeeklyReadingSection;
    range: WeeklyReadingDataset["range"];
    tone: WeeklyReadingDataset["tone"];
    sectionData: WeeklyReadingDataset["sections"][WeeklyReadingSection];
};

const currentUserRef = makeFunctionReference<
    "query",
    never,
    Doc<"users"> | null
>("user:currentUser");

const generateWeeklyReadingSectionRef = makeFunctionReference<
    "action",
    GenerateWeeklyReadingSectionArgs,
    void
>("weeklyReadingGeneration:generateWeeklyReadingSection");

export const ensureWeeklyReadings = action({
    args: {},
    handler: async (ctx) => {
        const user = await ctx.runQuery(currentUserRef, {});
        if (!user?.birthData) return null;

        const birthDate = new Date(user.birthData.birthday);
        if (Number.isNaN(birthDate.getTime())) return null;

        const week = getCurrentWeekRange();
        const generationId = crypto.randomUUID();
        const now = Date.now();

        const generation = await ctx.runMutation(startGenerationRef, {
            userId: user._id,
            generationId,
            weekReadingKey: week.key,
            startedAt: now,
        });

        if (!generation.shouldGenerate) return null;

        try {
            const transitChart = await fetchTransitRange({
                birthYear: birthDate.getUTCFullYear(),
                birthMonth: birthDate.getUTCMonth() + 1,
                birthDay: birthDate.getUTCDate(),
                birthHour: birthDate.getUTCHours(),
                birthMinute: birthDate.getUTCMinutes(),
                birthLatitude: user.birthData.latitude,
                birthLongitude: user.birthData.longitude,
                transitStartYear: week.start.getUTCFullYear(),
                transitStartMonth: week.start.getUTCMonth() + 1,
                transitStartDay: week.start.getUTCDate(),
                transitEndYear: week.end.getUTCFullYear(),
                transitEndMonth: week.end.getUTCMonth() + 1,
                transitEndDay: week.end.getUTCDate(),
                transitLatitude: user.birthData.latitude,
                transitLongitude: user.birthData.longitude,
                timezone: "UTC",
            });

            const stored = await ctx.runMutation(storeTransitChartRef, {
                userId: user._id,
                generationId,
                weekTransitChartLastCalculated: Date.now(),
                weekTransitChart: transitChart,
            });

            if (!stored) return null;

            const dataset = curateWeeklyReadingDataset(transitChart);

            await genWorkpool.enqueueActionBatch(
                ctx,
                generateWeeklyReadingSectionRef,
                weeklyReadingSections.map((section) => ({
                    userId: user._id,
                    generationId,
                    weekReadingKey: week.key,
                    section,
                    range: dataset.range,
                    tone: dataset.tone,
                    sectionData: dataset.sections[section],
                })),
                { retry: false },
            );

            return {
                weekReadingKey: week.key,
                generationId,
            };
        } catch (error) {
            await ctx.runMutation(recordGenerationErrorRef, {
                userId: user._id,
                generationId,
                error: errorMessage(error),
            });

            return null;
        }
    },
});

const startGenerationArgs = v.object({
    userId: v.id("users"),
    generationId: v.string(),
    weekReadingKey: v.string(),
    startedAt: v.number(),
});

const startGenerationRef = makeFunctionReference<
    "mutation",
    Infer<typeof startGenerationArgs>,
    { shouldGenerate: boolean }
>("weeklyReadings:startGeneration");

export const startGeneration = internalMutation({
    args: startGenerationArgs,
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) return { shouldGenerate: false };

        if (
            user.weekReadingKey === args.weekReadingKey &&
            user.weekReadingsStartedAt
        ) {
            return { shouldGenerate: false };
        }

        await ctx.db.patch(args.userId, {
            weekReadingKey: args.weekReadingKey,
            weekReadingsGenerationId: args.generationId,
            weekReadingsStartedAt: args.startedAt,
            weekReadingsError: undefined,
            weekReadingErrors: {},
            weekTransitChartLastCalculated: undefined,
            weekTransitChart: undefined,
            overallReading: undefined,
            loveReading: undefined,
            workReading: undefined,
            familyReading: undefined,
            friendsReading: undefined,
        });

        return { shouldGenerate: true };
    },
});

const storeTransitChartArgs = v.object({
    userId: v.id("users"),
    generationId: v.string(),
    weekTransitChartLastCalculated: v.number(),
    weekTransitChart: v.any() as VAny<SchemaCalculateTransitRangeResponse>,
});

const storeTransitChartRef = makeFunctionReference<
    "mutation",
    Infer<typeof storeTransitChartArgs>,
    boolean
>("weeklyReadings:storeTransitChart");

export const storeTransitChart = internalMutation({
    args: storeTransitChartArgs,
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!isCurrentGeneration(user, args.generationId)) return false;

        await ctx.db.patch(args.userId, {
            weekTransitChartLastCalculated: args.weekTransitChartLastCalculated,
            weekTransitChart: args.weekTransitChart,
            weekReadingsError: undefined,
        });

        return true;
    },
});

const storeSectionReadingArgs = v.object({
    userId: v.id("users"),
    generationId: v.string(),
    section: weeklyReadingSectionValidator,
    reading: v.string(),
});

export const storeSectionReadingRef = makeFunctionReference<
    "mutation",
    Infer<typeof storeSectionReadingArgs>,
    boolean
>("weeklyReadings:storeSectionReading");

export const storeSectionReading = internalMutation({
    args: storeSectionReadingArgs,
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!isCurrentGeneration(user, args.generationId)) return false;
        if (!user) return false;

        await ctx.db.patch(args.userId, {
            ...readingPatch(args.section, args.reading),
            weekReadingErrors: clearSectionError(
                user.weekReadingErrors,
                args.section,
            ),
        });

        return true;
    },
});

const recordSectionErrorArgs = v.object({
    userId: v.id("users"),
    generationId: v.string(),
    section: weeklyReadingSectionValidator,
    error: v.string(),
});

export const recordSectionErrorRef = makeFunctionReference<
    "mutation",
    Infer<typeof recordSectionErrorArgs>,
    boolean
>("weeklyReadings:recordSectionError");

export const recordSectionError = internalMutation({
    args: recordSectionErrorArgs,
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!isCurrentGeneration(user, args.generationId)) return false;
        if (!user) return false;

        await ctx.db.patch(args.userId, {
            weekReadingErrors: {
                ...(user.weekReadingErrors ?? {}),
                [args.section]: args.error,
            },
        });

        return true;
    },
});

const recordGenerationErrorArgs = v.object({
    userId: v.id("users"),
    generationId: v.string(),
    error: v.string(),
});

const recordGenerationErrorRef = makeFunctionReference<
    "mutation",
    Infer<typeof recordGenerationErrorArgs>,
    boolean
>("weeklyReadings:recordGenerationError");

export const recordGenerationError = internalMutation({
    args: recordGenerationErrorArgs,
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!isCurrentGeneration(user, args.generationId)) return false;

        await ctx.db.patch(args.userId, {
            weekReadingsError: args.error,
        });

        return true;
    },
});

function getCurrentWeekRange(now = new Date()) {
    const start = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const daysSinceMonday = (start.getUTCDay() + 6) % 7;
    start.setUTCDate(start.getUTCDate() - daysSinceMonday);

    const end = new Date(start);
    end.setUTCDate(start.getUTCDate() + 6);

    return {
        start,
        end,
        key: formatDate(start),
    };
}

function formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

function isCurrentGeneration(user: Doc<"users"> | null, generationId: string) {
    return user?.weekReadingsGenerationId === generationId;
}

function readingPatch(section: WeeklyReadingSection, reading: string) {
    switch (section) {
        case "overall":
            return { overallReading: reading };
        case "love":
            return { loveReading: reading };
        case "work":
            return { workReading: reading };
        case "family":
            return { familyReading: reading };
        case "friends":
            return { friendsReading: reading };
    }
}

function clearSectionError(
    errors: WeeklyReadingErrors | undefined,
    section: WeeklyReadingSection,
) {
    return {
        ...(errors ?? {}),
        [section]: undefined,
    };
}

function errorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
}
