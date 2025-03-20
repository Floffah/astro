"use client";

import * as Tabs from "@radix-ui/react-tabs";
import {
    ChartNoAxesGanttIcon,
    MoonIcon,
    SunDimIcon,
    SunriseIcon,
} from "lucide-react";
import { PropsWithChildren, Suspense } from "react";
import { operations } from "~types/apis/astrocalc";

import {
    getAscendantSignSummary,
    getMoonSignSummary,
    getSunSignSummary,
} from "@/actions/user/summaries";
import { SignSummary } from "@/app/home/MyProfileCard/SignSummary";
import { Icon } from "@/components/Icon";
import { TextSkeletonLoader } from "@/components/TextSkeletonLoader";

export function MyProfileTabs({
    signs,
    children,
}: PropsWithChildren<{
    signs: operations["calculateBirthChart"]["responses"]["200"]["content"]["application/json"]["signs"];
}>) {
    return (
        <Tabs.Root
            defaultValue="overview"
            className="flex flex-col gap-4 rounded-lg bg-gray-800 p-4 sm:flex-row"
        >
            <Tabs.List className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
                <Tabs.Trigger value="overview" asChild>
                    <p className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-white transition-colors data-[state=active]:bg-gray-700 data-[state=active]:text-blue-300">
                        <Icon label="Chart Overview">
                            <ChartNoAxesGanttIcon className="h-6 w-6" />
                        </Icon>
                        Me
                    </p>
                </Tabs.Trigger>
                <Tabs.Trigger value="sun" asChild>
                    <p className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-white transition-colors data-[state=active]:bg-gray-700 data-[state=active]:text-blue-300">
                        <Icon label="Sun Sign">
                            <SunDimIcon className="h-6 w-6" />
                        </Icon>

                        {signs!.sun!.value}
                    </p>
                </Tabs.Trigger>
                <Tabs.Trigger value="moon" asChild>
                    <p className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-white transition-colors data-[state=active]:bg-gray-700 data-[state=active]:text-blue-300">
                        <Icon label="Moon Sign">
                            <MoonIcon className="h-5 w-6" />
                        </Icon>

                        {signs!.moon!.value}
                    </p>
                </Tabs.Trigger>
                <Tabs.Trigger value="ascendant" asChild>
                    <p className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-white transition-colors data-[state=active]:bg-gray-700 data-[state=active]:text-blue-300">
                        <Icon label="Rising Sign">
                            <SunriseIcon className="h-5 w-6" />
                        </Icon>

                        {signs!.ascendant!.value}
                    </p>
                </Tabs.Trigger>
            </Tabs.List>

            <div className="flex flex-grow flex-col gap-2">
                <Tabs.Content value="overview" asChild>
                    {children}
                </Tabs.Content>

                <Tabs.Content value="sun" asChild>
                    <Suspense fallback={<TextSkeletonLoader />}>
                        <SignSummary handler={getSunSignSummary} />
                    </Suspense>
                </Tabs.Content>

                <Tabs.Content value="moon" asChild>
                    <Suspense fallback={<TextSkeletonLoader />}>
                        <SignSummary handler={getMoonSignSummary} />
                    </Suspense>
                </Tabs.Content>

                <Tabs.Content value="ascendant" asChild>
                    <Suspense fallback={<TextSkeletonLoader />}>
                        <SignSummary handler={getAscendantSignSummary} />
                    </Suspense>
                </Tabs.Content>

                <p className="text-sm text-gray-400">
                    If you&apos;re having trouble generating summaries -{" "}
                    <a
                        href="https://discord.gg/DsSeGSc5na"
                        target="_blank"
                        className="text-blue-500 hover:underline"
                    >
                        open a ticket
                    </a>{" "}
                </p>
            </div>
        </Tabs.Root>
    );
}
