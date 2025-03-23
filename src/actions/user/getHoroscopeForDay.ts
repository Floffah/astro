"use server";

import { generateText } from "ai";
import { eq } from "drizzle-orm";

import { db, horoscopes } from "@/db";
import { deepseek } from "@/lib/ai/deepseek";
import { getDailyTransits } from "@/lib/astrology/getDailyTransits";
import { getSessionFromRuntime } from "@/lib/data/getSession";

export async function getHoroscopeForDay(date: Date) {
    const { user } = await getSessionFromRuntime();

    if (!user || !user.onboarded) {
        return null;
    }

    const currentDate = new Date();

    if (!user.premium) {
        if (
            currentDate.getUTCFullYear() !== date.getUTCFullYear() ||
            currentDate.getUTCMonth() !== date.getUTCMonth() ||
            currentDate.getUTCDate() !== date.getUTCDate()
        ) {
            return null;
        }
    }

    let existingHoroscope = await db.query.horoscopes.findFirst({
        where: (horoscopes, { eq, and }) =>
            and(eq(horoscopes.userId, user.id), eq(horoscopes.date, date)),
    });

    if (existingHoroscope && existingHoroscope.summary) {
        return existingHoroscope.summary ?? null;
    }

    if (!existingHoroscope) {
        const insertResult = await db
            .insert(horoscopes)
            .values({
                userId: user.id,
                type: "daily",
                date,
                summary:
                    "Your summary is still generating. Check back in about a minute. (You may need to refresh)",
            })
            .returning();
        existingHoroscope = insertResult[0];
    }

    const transitChart = await getDailyTransits({
        birthDate: user.birthTimestamp!,
        birthLat: user.birthLatitude!,
        birthLong: user.birthLongitude!,
        transitDate: date,
        transitLat: user.birthLatitude!,
        transitLong: user.birthLongitude!,
    });

    const { text: summary } = await generateText({
        model: deepseek("deepseek-chat"),
        system: "You are tasked with analysing provided astrological information and generating a horoscope for a user. A natal planetary chart AND transit chart for the current day are both provided in json format. The transit chart includes a format similar to the natal birth chart **but is calculated for the current day, not birth date**. The transit chart also includes notable information like which planets are in retrograde, and a list of ingresses: planets that moved into another sign today. Your job is to analyse this information and provide the user with a short summary of what their day will be like. You may use reference to any valid part of western (tropical, placidius) astrology. Doesn't need to be short, write as much as you need to get the point across - but keep the text efficient and to the point. Do not make anything up. All of your responses should be based on the information provided in the transit chart, backed up by the natal chart if needs be. You are able to use remark markdown if you wish, but keep it to a minimum. Do not use headings. Write in paragraphs only.",
        prompt: `User's natal birth chart:\`\`\`json\n${JSON.stringify(user.cachedNatalPlanetPositions!)}\n\`\`\`\nUser's daily transit chart:\`\`\`json\n${JSON.stringify(transitChart)}\n\`\`\``,
        temperature: 1.0,
    });

    await db
        .update(horoscopes)
        .set({
            summary,
        })
        .where(eq(horoscopes.id, existingHoroscope.id));

    return summary;
}
