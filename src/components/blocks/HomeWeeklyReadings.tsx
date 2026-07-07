"use client";

import { useAction } from "convex/react";
import {
    BriefcaseIcon,
    HeartIcon,
    HomeIcon,
    SparklesIcon,
    UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/api";
import { useUser } from "@/lib/hooks/useUser";

const readingSections = [
    {
        key: "overallReading",
        errorKey: "overall",
        title: "Overall week",
        icon: SparklesIcon,
    },
    {
        key: "loveReading",
        errorKey: "love",
        title: "Love",
        icon: HeartIcon,
    },
    {
        key: "familyReading",
        errorKey: "family",
        title: "Family",
        icon: HomeIcon,
    },
    {
        key: "friendsReading",
        errorKey: "friends",
        title: "Friends",
        icon: UsersIcon,
    },
    {
        key: "workReading",
        errorKey: "work",
        title: "Work",
        icon: BriefcaseIcon,
    },
] as const;

export default function HomeWeeklyReadings() {
    const user = useUser();
    const ensureWeeklyReadings = useAction(
        api.weeklyReadings.ensureWeeklyReadings,
    );
    const requestedForUser = useRef<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.birthData || requestedForUser.current === user._id) return;

        requestedForUser.current = user._id;
        void ensureWeeklyReadings({}).catch((error) => {
            setActionError(
                error instanceof Error ? error.message : String(error),
            );
        });
    }, [ensureWeeklyReadings, user]);

    const hasAnyReading = useMemo(
        () =>
            !!user &&
            readingSections.some((section) => Boolean(user[section.key])),
        [user],
    );

    if (user === undefined) {
        return (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Spinner className="size-4" />
                Loading your chart.
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-xl border border-border bg-card p-6">
                <p className="font-serif text-3xl leading-tight">
                    Sign in to read your week.
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Your weekly reading is based on your saved birth chart.
                </p>
            </div>
        );
    }

    if (!user.birthData || !user.birthChart) {
        return (
            <div className="max-w-xl border border-border bg-card p-6">
                <p className="font-serif text-3xl leading-tight">
                    Add your birth details first.
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    The weekly reading needs your birth date, time, and place.
                </p>
                <Button className="mt-6" asChild>
                    <Link href="/onboarding">Set up chart</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8">
            <div className="max-w-3xl">
                <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                    This week
                </p>
                <h1 className="font-serif text-5xl leading-none text-balance sm:text-6xl">
                    Your weekly reading
                </h1>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {!hasAnyReading && !user.weekReadingsError && (
                        <>
                            <Spinner className="size-4" />
                            Preparing your reading.
                        </>
                    )}
                    {user.weekReadingKey && (
                        <span>Week of {user.weekReadingKey}</span>
                    )}
                    {actionError && <span>{actionError}</span>}
                    {user.weekReadingsError && (
                        <span>{user.weekReadingsError}</span>
                    )}
                </div>
            </div>

            <div className="flex flex-col divide-y">
                {readingSections.map((section) => {
                    const Icon = section.icon;
                    const reading = user[section.key];
                    const error = user.weekReadingErrors?.[section.errorKey];

                    return (
                        <section key={section.key} className="max-w-xl py-5">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                    {section.title}
                                </h2>
                                <Icon className="size-4 text-muted-foreground" />
                            </div>

                            {reading ? (
                                <p className="text-base leading-7">{reading}</p>
                            ) : (
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    {error ? (
                                        <span>{error}</span>
                                    ) : (
                                        <>
                                            <Spinner className="size-4" />
                                            Reading in progress.
                                        </>
                                    )}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
