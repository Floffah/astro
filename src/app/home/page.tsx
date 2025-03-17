import { redirect } from "next/navigation";
import { Suspense } from "react";

import { UserSummary } from "@/app/home/UserSummary";
import { getSessionFromRuntime } from "@/lib/data/getSession";

export default async function HomePage() {
    const { user } = await getSessionFromRuntime();

    if (user && !user.onboarded) {
        redirect("/onboarding");
        return null;
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-end border-b border-b-gray-800 px-4 py-2">
                <p className="font-semibold text-white">Logout</p>
            </div>

            <h1 className="text-3xl font-bold text-white">You</h1>

            <Suspense
                fallback={
                    <div className="h-36 w-full animate-pulse rounded-lg bg-gray-800" />
                }
            >
                <UserSummary />
            </Suspense>
        </div>
    );
}
