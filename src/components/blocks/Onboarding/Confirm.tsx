import { convexAction } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    BadgeCheckIcon,
    MoonIcon,
    RotateCcwIcon,
    SunIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useSnapshot } from "valtio/react";

import { onboardingFormState } from "@/components/blocks/Onboarding/state";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/api";
import { useUser } from "@/lib/hooks/useUser";

const MotionCard = motion.create(Card);

export default function OnboardingConfirm({ back }: { back: () => void }) {
    const user = useUser();

    const data = useSnapshot(onboardingFormState);

    const completeQuery = useQuery(
        convexAction(api.onboarding.createNatalChart, {
            birthday: data.birthday,
            latitude: data.birthPlaceLat,
            longitude: data.birthPlaceLng,
        }),
    );

    if (completeQuery.isError) {
        return (
            <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <CardHeader>
                    <div className="flex gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center border border-border bg-background">
                            <RotateCcwIcon />
                        </div>
                        <div className="space-y-1.5">
                            <CardTitle>Chart unavailable</CardTitle>
                            <CardDescription>
                                We could not calculate the chart. Check the
                                date, time, and coordinates.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardFooter className="justify-between gap-3">
                    <Button type="button" variant="outline" onClick={back}>
                        <ArrowLeftIcon data-icon="inline-start" />
                        Edit details
                    </Button>

                    <Button
                        type="button"
                        onClick={() => completeQuery.refetch()}
                    >
                        Try again
                        <RotateCcwIcon data-icon="inline-end" />
                    </Button>
                </CardFooter>
            </MotionCard>
        );
    }

    if (!completeQuery.isSuccess || !user || !user.birthChart) {
        return (
            <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <CardHeader>
                    <div className="flex gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center border border-border bg-background">
                            <Spinner className="size-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-1.5">
                            <CardTitle>Computing your birth chart</CardTitle>
                            <CardDescription>
                                Calculating the Sun, Moon, and rising signs.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </MotionCard>
        );
    }

    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <CardHeader>
                <div className="flex gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center border border-border bg-background">
                        <BadgeCheckIcon />
                    </div>
                    <div className="space-y-1.5">
                        <CardTitle>Your chart is ready</CardTitle>
                        <CardDescription>
                            Here are the signs we calculated from your birth
                            details.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="border border-border bg-background p-4">
                        <div className="mb-5 flex items-center justify-between gap-3 text-muted-foreground">
                            <p className="text-xs font-semibold tracking-widest uppercase">
                                Sun
                            </p>
                            <SunIcon className="size-4" />
                        </div>
                        <p className="font-serif text-2xl leading-none">
                            {user.birthChart.signs.sun.value}
                        </p>
                    </div>
                    <div className="border border-border bg-background p-4">
                        <div className="mb-5 flex items-center justify-between gap-3 text-muted-foreground">
                            <p className="text-xs font-semibold tracking-widest uppercase">
                                Moon
                            </p>
                            <MoonIcon className="size-4" />
                        </div>
                        <p className="font-serif text-2xl leading-none">
                            {user.birthChart.signs.moon.value}
                        </p>
                    </div>
                    <div className="border border-border bg-background p-4">
                        <div className="mb-5 flex items-center justify-between gap-3 text-muted-foreground">
                            <p className="text-xs font-semibold tracking-widest uppercase">
                                Rising
                            </p>
                            <RotateCcwIcon className="size-4" />
                        </div>
                        <p className="font-serif text-2xl leading-none">
                            {user.birthChart.signs.ascendant.value}
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="justify-between gap-3">
                <Button type="button" variant="outline" onClick={back}>
                    <ArrowLeftIcon data-icon="inline-start" />
                    Edit details
                </Button>

                <Button type="button" asChild>
                    <Link href="/home">
                        Use this chart
                        <ArrowRightIcon data-icon="inline-end" />
                    </Link>
                </Button>
            </CardFooter>
        </MotionCard>
    );
}
