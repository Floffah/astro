import { redirect } from "next/navigation";
import { Suspense } from "react";

import {
    DayAtAGlance,
    DayAtAGlanceFallback,
} from "@/app/(nav_layout)/home/DayAtAGlance";
import { HoroscopeTimeline } from "@/app/(nav_layout)/home/HoroscopeTimeline";
import { HoroscopeTimelineLoader } from "@/app/(nav_layout)/home/HoroscopeTimeline/loader";
import { MyProfileCard } from "@/app/(nav_layout)/home/MyProfileCard";
import { getSessionFromRuntime } from "@/lib/data/getSession";

export default async function HomePage() {
    const { user } = await getSessionFromRuntime();

    if (user && !user.onboarded) {
        redirect("/onboarding");
        return null;
    }

    return (
        <main className="flex w-full flex-col items-center gap-4 p-4">
            <Suspense
                fallback={
                    <div className="h-36 w-full animate-pulse rounded-lg bg-gray-800" />
                }
            >
                <MyProfileCard />
            </Suspense>

            <Suspense fallback={<DayAtAGlanceFallback />}>
                <DayAtAGlance />
            </Suspense>

            {user && (
                <Suspense fallback={<HoroscopeTimelineLoader />}>
                    <HoroscopeTimeline />
                </Suspense>
            )}
        </main>
    );
}
