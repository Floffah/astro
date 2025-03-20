import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LogoutButton } from "@/app/home/LogoutButton";
import { MyProfileCard } from "@/app/home/MyProfileCard";
import { getSessionFromRuntime } from "@/lib/data/getSession";

export default async function HomePage() {
    const { user } = await getSessionFromRuntime();

    if (user && !user.onboarded) {
        redirect("/onboarding");
        return null;
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between border-b border-b-gray-800 px-4 py-2">
                <p className="text-xl font-bold text-white">My Atlas</p>

                <LogoutButton />
            </div>

            <Suspense
                fallback={
                    <div className="h-36 w-full animate-pulse rounded-lg bg-gray-800" />
                }
            >
                <MyProfileCard />
            </Suspense>
        </div>
    );
}
