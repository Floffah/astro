import { SchemaCalculateDailyTransitsResponse } from "~types/apis/astrocalc";

import { User } from "@/db";
import { UserError } from "@/lib/errors/UserError";

export function getSignSummaryPrompt(
    sign: "sun" | "moon" | "ascendant",
    user: User,
) {
    if (!user.onboarded || !user.cachedNatalPlanetPositions) {
        throw new Error(UserError.NOT_ONBOARDED);
    }

    let userSign;

    if (sign === "sun") {
        userSign = user.cachedNatalPlanetPositions.signs.sun.value;
    } else if (sign === "moon") {
        userSign = user.cachedNatalPlanetPositions.signs.moon.value;
    } else if (sign === "ascendant") {
        userSign = user.cachedNatalPlanetPositions.signs.ascendant.value;
    }

    const stringifiedChart = JSON.stringify({
        birthDate: user.birthTimestamp!.toISOString(),
        lat: user.birthLatitude,
        long: user.birthLongitude,
        natalChart: user.cachedNatalPlanetPositions,
    });

    return {
        system: `You are a tasked with analysing astrological information about a user. A natal planetary chart is provided in json format. Your job is to analyse this information and provide the user with a short summary of specifically what their **${sign === "ascendant" ? "ascendant (rising)" : sign} sign** means for them. For clarification, the ${sign} sign will be emphasised to you. This is not a summary of anything except the ${sign} sign. You may use reference to any valid part of western (tropical, placidius) astrology. Keep it short and sweet. Do not make anything up. All of your responses should be based on the information provided in the chart. You are able to use remark markdown if you wish, but keep it to a minimum (no headings).`,
        prompt: `The user's ${sign} sign is: ${userSign}. \n\nTheir full birth chart is as follows\n\n\`\`\`json\n${stringifiedChart}\n\`\`\``,
    };
}

export function getHoroscopeSummaryPrompt(
    user: User,
    date: Date,
    transitChart: SchemaCalculateDailyTransitsResponse,
) {
    if (!user.onboarded || !user.cachedNatalPlanetPositions) {
        throw new Error(UserError.NOT_ONBOARDED);
    }

    const stringifiedNatalChart = JSON.stringify(
        user.cachedNatalPlanetPositions,
    );
    const stringifiedTransitChart = JSON.stringify(transitChart);

    return {
        system: "You are tasked with analysing provided astrological information and generating a horoscope for a user. A natal planetary chart AND transit chart for the current day are both provided in json format. The transit chart includes a format similar to the natal birth chart **but is calculated for the current day, not birth date**. The transit chart also includes notable information like which planets are in retrograde, and a list of ingresses: planets that moved into another sign today. Your job is to analyse this information and provide the user with a short summary of what their day will be like. You may use reference to any valid part of western (tropical, placidius) astrology. Doesn't need to be short, write as much as you need to get the point across - but keep the text efficient and to the point. Do not make anything up. All of your responses should be based on the information provided in the transit chart, backed up by the natal chart if needs be. You are able to use remark markdown if you wish, but keep it to a minimum. Do not use headings. Write in paragraphs only.",
        prompt: `User's natal birth chart:\`\`\`json\n${stringifiedNatalChart}\n\`\`\`\nUser's daily transit chart:\`\`\`json\n${stringifiedTransitChart}\n\`\`\`\n\nDate of horoscope is: ${date.toISOString()}`,
    };
}
