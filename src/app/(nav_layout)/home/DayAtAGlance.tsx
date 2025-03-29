import { withTracing } from "@posthog/ai";
import { generateText } from "ai";
import { eq } from "drizzle-orm";

import { TextSkeletonLoader } from "@/components/TextSkeletonLoader";
import { db, users } from "@/db";
import { deepseek } from "@/lib/ai/deepseek";
import { getHoroscopeGlanceMessagePrompt } from "@/lib/ai/prompts";
import { getPostHogNodeClient } from "@/lib/analytics/nodeClient";
import { getDailyTransits } from "@/lib/astrology/getDailyTransits";
import { getSessionFromRuntime } from "@/lib/data/getSession";

export function DayAtAGlanceFallback() {
    return (
        <div className="flex w-full max-w-xl flex-col gap-2 py-8">
            <p className="text-center text-xl font-semibold text-white">
                {Intl.DateTimeFormat("en-GB", {
                    dateStyle: "medium",
                }).format(new Date())}
            </p>
            <TextSkeletonLoader />
        </div>
    );
}

export async function DayAtAGlance() {
    const { user } = await getSessionFromRuntime();

    if (!user || !user.onboarded) {
        return <DayAtAGlanceFallback />;
    }

    const todaysDate = new Date();

    console.log(
        user.dayAtAGlance,
        user.glanceGeneratedAt?.getDate(),
        todaysDate.getDate(),
        user.glanceGeneratedAt?.getMonth(),
        todaysDate.getMonth(),
        user.glanceGeneratedAt?.getFullYear(),
        todaysDate.getFullYear(),
    );

    if (
        user.dayAtAGlance &&
        user.glanceGeneratedAt?.getDate() === todaysDate.getDate() &&
        user.glanceGeneratedAt?.getMonth() === todaysDate.getMonth() &&
        user.glanceGeneratedAt?.getFullYear() === todaysDate.getFullYear()
    ) {
        return (
            <div className="flex max-w-xl flex-col py-8">
                <p className="text-center text-xl font-semibold text-white">
                    {Intl.DateTimeFormat("en-GB", {
                        dateStyle: "medium",
                    }).format(todaysDate)}
                </p>
                <p className="text-center text-base text-gray-300">
                    {user.dayAtAGlance}
                </p>
            </div>
        );
    }

    const transitChart = await getDailyTransits({
        birthDate: user.birthTimestamp!,
        birthLat: user.birthLatitude!,
        birthLong: user.birthLongitude!,
        transitDate: todaysDate,
        transitLat: user.birthLatitude!,
        transitLong: user.birthLongitude!,
    });

    const prompt = getHoroscopeGlanceMessagePrompt(
        user,
        todaysDate,
        transitChart,
    );

    const posthog = getPostHogNodeClient();

    const { text: summary } = await generateText({
        model: withTracing(deepseek("deepseek-chat"), posthog, {
            posthogDistinctId: user.publicId,
            posthogProperties: {
                type: "user_horoscope_glance",
                for_date: todaysDate,
            },
        }),
        ...prompt,
        temperature: 1.0,
    });

    await db
        .update(users)
        .set({
            dayAtAGlance: summary,
            glanceGeneratedAt: new Date(),
        })
        .where(eq(users.id, user.id));

    return (
        <div className="flex max-w-xl flex-col py-8">
            <p className="text-center text-xl font-semibold text-white">
                {Intl.DateTimeFormat("en-GB", {
                    dateStyle: "medium",
                }).format(todaysDate)}
            </p>
            <p className="text-center text-base text-gray-300">{summary}</p>
        </div>
    );
}
