import { Suspense } from "react";

import { AIProfileSummary } from "@/app/home/MyProfileCard/AIProfileSummary";
import { MyProfileTabs } from "@/app/home/MyProfileCard/MyProfileTabs";
import { TextSkeletonLoader } from "@/components/TextSkeletonLoader";
import { getSessionFromRuntime } from "@/lib/data/getSession";

export async function MyProfileCard() {
    const { user } = await getSessionFromRuntime();

    if (!user || !user.onboarded || !user.cachedNatalPlanetPositions) {
        return (
            <p className="text-center text-sm text-gray-300">
                Edit your birth chart to get your personalised summary
            </p>
        );
    }

    return (
        <MyProfileTabs signs={user.cachedNatalPlanetPositions.signs}>
            <Suspense fallback={<TextSkeletonLoader />}>
                <AIProfileSummary />
            </Suspense>
        </MyProfileTabs>
    );
}
