import { generateText } from "ai";
import { eq } from "drizzle-orm";
import { Remark, useRemarkSync } from "react-remark";

import { db, users } from "@/db";
import { deepseek } from "@/lib/ai/deepseek";
import { getSessionFromRuntime } from "@/lib/data/getSession";

export async function UserSummary() {
    const { user } = await getSessionFromRuntime();

    if (!user || !user.onboarded) {
        return (
            <p className="text-center text-sm text-gray-300">
                Edit your birth chart to get your personalised summary
            </p>
        );
    }

    let summary = user.summary;

    if (!summary) {
        const { text } = await generateText({
            model: deepseek("deepseek-chat"),
            system: "You are a tasked with analysing astrological information about a user. A natal planetary chart is provided in json format. Your job is to analyse this information and provide the user with a short summary, maximum 2 paragraphs, of what their astrological chart says about them. The user is interested in knowing about what their life will be like based on their chart. This could include personality, career, relationships, and *more* they may want to know. You should not make reference to any part of astrology, even planets, if you must say what you are referencing, just say something like 'your chart says this'. Your analysis should be based on everything however, its just your response to the user that should be simplified",
            prompt: JSON.stringify({
                birthDate: user.birthTimestamp!.toISOString(),
                lat: user.birthLatitude,
                long: user.birthLongitude,
                natalChart: user.cachedNatalPlanetPositions,
            }),
        });

        summary = text;

        await db
            .update(users)
            .set({
                summary: text,
            })
            .where(eq(users.id, user.id));
    }

    return (
        <div className="prose prose-invert prose-sm w-full">
            {/* eslint-disable-next-line react-hooks/rules-of-hooks -- this is not actually a hook */}
            {useRemarkSync(summary)}
        </div>
    );
}
