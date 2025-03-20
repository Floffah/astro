import { MoonIcon, SunDimIcon, SunriseIcon } from "lucide-react";
import { Suspense } from "react";

import { AIProfileSummary } from "@/app/home/MyProfileCard/AIProfileSummary";
import { Icon } from "@/components/Icon";
import { Loader } from "@/components/Loader";
import { getSessionFromRuntime } from "@/lib/data/getSession";

export async function MyProfileCard() {
    const { user } = await getSessionFromRuntime();

    if (!user || !user.onboarded) {
        return (
            <p className="text-center text-sm text-gray-300">
                Edit your birth chart to get your personalised summary
            </p>
        );
    }

    console.log(user.cachedNatalPlanetPositions);

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-gray-800 p-4 sm:flex-row">
            {user.cachedNatalPlanetPositions && (
                <div className="flex shrink-0 flex-col gap-2">
                    <p className="flex items-center gap-2 text-white">
                        <Icon label="Sun Sign">
                            <SunDimIcon className="h-6 w-6" />
                        </Icon>

                        {user.cachedNatalPlanetPositions.signs!.sun!.value}
                    </p>
                    <p className="flex items-center gap-2 text-white">
                        <Icon label="Sun Sign">
                            <MoonIcon className="h-5 w-6" />
                        </Icon>

                        {user.cachedNatalPlanetPositions.signs!.moon!.value}
                    </p>
                    <p className="flex items-center gap-2 text-white">
                        <Icon label="Sun Sign">
                            <SunriseIcon className="h-4 w-6" />
                        </Icon>

                        {
                            user.cachedNatalPlanetPositions.signs!.ascendant!
                                .value
                        }
                    </p>
                </div>
            )}

            <Suspense
                fallback={
                    <div className="flex flex-grow items-center justify-center">
                        <Loader className="text-gray-500" />
                    </div>
                }
            >
                <AIProfileSummary />
            </Suspense>
        </div>
    );
}
