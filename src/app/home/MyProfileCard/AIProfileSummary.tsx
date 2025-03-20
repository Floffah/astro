import { generateText } from "ai";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { useRemarkSync } from "react-remark";

import { db, users } from "@/db";
import { deepseek } from "@/lib/ai/deepseek";
import { getSessionFromRuntime } from "@/lib/data/getSession";

// TODO: refactor this to match the style of the other ai summary components

export async function AIProfileSummary() {
    const { user } = await getSessionFromRuntime();

    if (!user || !user.cachedNatalPlanetPositions) {
        return (
            <p className="text-center text-sm text-gray-300">
                You don&apos; seem to have a birth chart set up yet.{" "}
                <Link
                    href="/onboarding"
                    className="text-blue-400 hover:underline"
                >
                    Set it up
                </Link>
            </p>
        );
    }

    let summary = user.summary;

    if (!summary) {
        await db
            .update(users)
            .set({
                summary:
                    "Your summary is still generating. Check back in about a minute. (You may need to refresh)",
            })
            .where(eq(users.id, user.id));

        const { text } = await generateText({
            model: deepseek("deepseek-chat"),
            system: "You are a tasked with analysing astrological information about a user. A natal planetary chart is provided in json format. Your job is to analyse this information and provide the user with a short summary, maximum 2 paragraphs, of what their astrological chart says about them. The user is interested in knowing about what their life will be like based on their chart. This could include personality, career, relationships, and *more* they may want to know. You should not mention specifically any part of astrology, like planets, but if you must say what you are referencing: just say something like 'your chart says this'. Your analysis should be based on everything however, its just your response to the user that should be simplified. Do not make anything up. All of your responses should be based on the information provided in the chart. You are able to use remark markdown if you wish, but keep it to a minimum (no headings).",
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
