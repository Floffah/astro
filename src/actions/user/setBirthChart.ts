"use server";

import { eq } from "drizzle-orm";

import { db, users } from "@/db";
import { getNatalChart } from "@/lib/astrology/getNatalChart";
import { getSessionFromRuntime } from "@/lib/data/getSession";

export async function setBirthChart(data: {
    birthDate: Date;
    lat: number;
    long: number;
}) {
    const { user } = await getSessionFromRuntime();

    if (!user) {
        return {
            success: false,
            error: "No user",
        };
    }

    if (user.cachedNatalPlanetPositions) {
        return {
            success: false,
            error: "Birth chart already set",
        };
    }

    await db
        .update(users)
        .set({
            birthTimestamp: data.birthDate,
            birthLatitude: data.lat,
            birthLongitude: data.long,
        })
        .where(eq(users.id, user.id));

    const natalChart = await getNatalChart(data);

    console.log(natalChart);

    await db
        .update(users)
        .set({
            cachedNatalPlanetPositions: natalChart,
            onboarded: true,
        })
        .where(eq(users.id, user.id));

    return {
        success: true,
    };
}
// 56.119911,-3.173110
