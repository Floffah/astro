"use node";

import { Output, generateText } from "ai";
import { makeFunctionReference } from "convex/server";
import { Infer, VAny, v } from "convex/values";
import { z } from "zod";

import type { Id } from "@/convex/dataModel";
import { internalAction } from "@/convex/server";
import type { WeeklyReadingDataset } from "@/lib/weekly-transits";

import { openrouter } from "./lib/ai";
import {
    type WeeklyReadingSection,
    weeklyReadingSectionValidator,
} from "./lib/weeklyReadingShared";

const readingResultSchema = z.object({
    paragraph: z.string().min(1),
    evidence: z.array(z.string()).max(8),
});

const generateWeeklyReadingSectionArgs = v.object({
    userId: v.id("users"),
    generationId: v.string(),
    weekReadingKey: v.string(),
    section: weeklyReadingSectionValidator,
    range: v.any() as VAny<WeeklyReadingDataset["range"]>,
    tone: v.any() as VAny<WeeklyReadingDataset["tone"]>,
    sectionData: v.any() as VAny<
        WeeklyReadingDataset["sections"][WeeklyReadingSection]
    >,
});

const storeSectionReadingRef = makeFunctionReference<
    "mutation",
    {
        userId: Id<"users">;
        generationId: string;
        section: WeeklyReadingSection;
        reading: string;
    },
    boolean
>("weeklyReadings:storeSectionReading");

const recordSectionErrorRef = makeFunctionReference<
    "mutation",
    {
        userId: Id<"users">;
        generationId: string;
        section: WeeklyReadingSection;
        error: string;
    },
    boolean
>("weeklyReadings:recordSectionError");

export const generateWeeklyReadingSection = internalAction({
    args: generateWeeklyReadingSectionArgs,
    handler: async (ctx, args) => {
        try {
            const { output } = await generateText({
                model: openrouter("openai/gpt-4o-mini"),
                system: systemPrompt,
                prompt: buildPrompt(args),
                temperature: 0.4,
                maxOutputTokens: 350,
                output: Output.object({
                    schema: readingResultSchema,
                }),
            });

            await ctx.runMutation(storeSectionReadingRef, {
                userId: args.userId,
                generationId: args.generationId,
                section: args.section,
                reading: output.paragraph.trim(),
            });
        } catch (error) {
            await ctx.runMutation(recordSectionErrorRef, {
                userId: args.userId,
                generationId: args.generationId,
                section: args.section,
                error: errorMessage(error),
            });
        }
    },
});

type GenerateWeeklyReadingSectionArgs = Infer<
    typeof generateWeeklyReadingSectionArgs
>;

const systemPrompt = [
    "You write short weekly astrology readings.",
    "Use only the supplied chart evidence.",
    "Do not invent events, outcomes, people, or dates.",
    "Treat astrology as symbolic weather: themes, pressures, opportunities, cautions.",
    "Write plainly. Avoid mystical filler and marketing language.",
].join(" ");

function buildPrompt(args: GenerateWeeklyReadingSectionArgs) {
    return JSON.stringify({
        task: `Write the ${sectionLabel(args.section)} paragraph.`,
        constraints: [
            "Return one paragraph of 45 to 75 words.",
            "Mention concrete themes from the evidence.",
            "Use cautious language such as may, watch for, or this is a good week for.",
            "Return evidence IDs used in the evidence array.",
        ],
        range: args.range,
        tone: args.tone,
        section: args.section,
        evidence: args.sectionData,
    });
}

function sectionLabel(section: WeeklyReadingSection) {
    switch (section) {
        case "overall":
            return "overall week";
        case "love":
            return "week in love";
        case "family":
            return "week with family";
        case "friends":
            return "week with friends";
        case "work":
            return "week at work";
    }
}

function errorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
}
