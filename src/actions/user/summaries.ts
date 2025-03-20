"use server";

import { generateText } from "ai";
import { eq } from "drizzle-orm";
import { after } from "next/server";

import { db, users } from "@/db";
import { deepseek } from "@/lib/ai/deepseek";
import { getSessionFromRuntime } from "@/lib/data/getSession";

export async function getSunSignSummary() {
    const { user } = await getSessionFromRuntime();

    if (!user) {
        return {
            error: "User not found",
            content: null,
        };
    }

    if (user.sunSignSummary) {
        return {
            error: null,
            content: user.sunSignSummary,
        };
    }

    if (!user.onboarded || !user.cachedNatalPlanetPositions) {
        return {
            error: "User not onboarded",
            content: null,
        };
    }

    await db
        .update(users)
        .set({
            sunSignSummary:
                "Your summary is still generating. Check back in about a minute. (You may need to refresh)",
        })
        .where(eq(users.id, user.id));

    const { text } = await generateText({
        model: deepseek("deepseek-chat"),
        system: "You are a tasked with analysing astrological information about a user. A natal planetary chart is provided in json format. Your job is to analyse this information and provide the user with a short summary of specifically what their **sun sign** means for them. For clarification, the sun sign will be emphasised to you. This is not a summary of anything except the sun sign. You may use reference to any valid part of western (tropical, placidius) astrology. Keep it short and sweet. Do not make anything up. All of your responses should be based on the information provided in the chart. You are able to use remark markdown if you wish, but keep it to a minimum (no headings).",
        prompt: `The user's sun sign is: ${user.cachedNatalPlanetPositions.signs!.sun}. \n\nTheir full birth chart is as follows\n\n\`\`\`json\n${JSON.stringify(
            {
                birthDate: user.birthTimestamp!.toISOString(),
                lat: user.birthLatitude,
                long: user.birthLongitude,
                natalChart: user.cachedNatalPlanetPositions,
            },
        )}\n\`\`\``,
    });

    after(async () => {
        await db
            .update(users)
            .set({
                sunSignSummary: text,
            })
            .where(eq(users.id, user.id));
    });

    return {
        content: text,
        error: null,
    };
}

export async function getMoonSignSummary() {
    const { user } = await getSessionFromRuntime();

    if (!user) {
        return {
            error: "User not found",
            content: null,
        };
    }

    if (user.moonSignSummary) {
        return {
            error: null,
            content: user.moonSignSummary,
        };
    }

    if (!user.onboarded || !user.cachedNatalPlanetPositions) {
        return {
            error: "User not onboarded",
            content: null,
        };
    }

    await db
        .update(users)
        .set({
            moonSignSummary:
                "Your summary is still generating. Check back in about a minute. (You may need to refresh)",
        })
        .where(eq(users.id, user.id));

    const { text } = await generateText({
        model: deepseek("deepseek-chat"),
        system: "You are a tasked with analysing astrological information about a user. A natal planetary chart is provided in json format. Your job is to analyse this information and provide the user with a short summary of specifically what their **moon sign** means for them. For clarification, the moon sign will be emphasised to you. This is not a summary of anything except the moon sign. You may use reference to any valid part of western (tropical, placidius) astrology. Keep it short and sweet. Do not make anything up. All of your responses should be based on the information provided in the chart. You are able to use remark markdown if you wish, but keep it to a minimum (no headings).",
        prompt: `The user's moon sign is: ${user.cachedNatalPlanetPositions.signs!.moon}. \n\nTheir full birth chart is as follows\n\n\`\`\`json\n${JSON.stringify(
            {
                birthDate: user.birthTimestamp!.toISOString(),
                lat: user.birthLatitude,
                long: user.birthLongitude,
                natalChart: user.cachedNatalPlanetPositions,
            },
        )}\n\`\`\``,
    });

    after(async () => {
        await db
            .update(users)
            .set({
                moonSignSummary: text,
            })
            .where(eq(users.id, user.id));
    });

    return {
        content: text,
        error: null,
    };
}

export async function getAscendantSignSummary() {
    const { user } = await getSessionFromRuntime();

    if (!user) {
        return {
            error: "User not found",
            content: null,
        };
    }

    if (user.ascendantSignSummary) {
        return {
            error: null,
            content: user.ascendantSignSummary,
        };
    }

    if (!user.onboarded || !user.cachedNatalPlanetPositions) {
        return {
            error: "User not onboarded",
            content: null,
        };
    }

    await db
        .update(users)
        .set({
            ascendantSignSummary:
                "Your summary is still generating. Check back in about a minute. (You may need to refresh)",
        })
        .where(eq(users.id, user.id));

    console.log(
        `The user's ascendant/rising sign is: ${user.cachedNatalPlanetPositions.signs!.ascendant}`,
    );

    const { text } = await generateText({
        model: deepseek("deepseek-chat"),
        system: "You are a tasked with analysing astrological information about a user. A natal planetary chart is provided in json format. Your job is to analyse this information and provide the user with a short summary of specifically what their **ascendant (rising) sign** means for them. For clarification, the ascendant sign will be emphasised to you. This is not a summary of anything except the ascendant sign. You may use reference to any valid part of western (tropical, placidius) astrology. Keep it short and sweet. Do not make anything up. All of your responses should be based on the information provided in the chart. You are able to use remark markdown if you wish, but keep it to a minimum (no headings).",
        prompt: `The user's ascendant/rising sign is: ${user.cachedNatalPlanetPositions.signs!.ascendant}. \n\nTheir full birth chart is as follows\n\n\`\`\`json\n${JSON.stringify(
            {
                birthDate: user.birthTimestamp!.toISOString(),
                lat: user.birthLatitude,
                long: user.birthLongitude,
                natalChart: user.cachedNatalPlanetPositions,
            },
        )}\n\`\`\``,
    });

    after(async () => {
        await db
            .update(users)
            .set({
                ascendantSignSummary: text,
            })
            .where(eq(users.id, user.id));
    });

    return {
        content: text,
        error: null,
    };
}
