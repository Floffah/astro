"use client";

import { useMachine } from "@xstate/react";
import { CheckIcon, SparklesIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect } from "react";

import OnboardingBirthLocation from "@/components/blocks/Onboarding/BirthLocation";
import OnboardingBirthday from "@/components/blocks/Onboarding/Birthday";
import OnboardingConfirm from "@/components/blocks/Onboarding/Confirm";
import {
    onboardingFormState,
    onboardingMachine,
} from "@/components/blocks/Onboarding/state";
import { useUser } from "@/lib/hooks/useUser";
import { cn } from "@/lib/utils";

export default function Onboarding() {
    const user = useUser();

    const [state, send] = useMachine(onboardingMachine);

    useEffect(() => {
        if (user?.birthData) {
            onboardingFormState.birthday = user.birthData.birthday;
            onboardingFormState.birthPlaceLat = user.birthData.latitude;
            onboardingFormState.birthPlaceLng = user.birthData.longitude;
        }
    }, [user?.birthData]);

    return (
        <main className="min-h-svh overflow-hidden bg-background text-foreground">
            <div className="mx-auto grid min-h-svh w-full max-w-6xl items-center gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
                <section className="max-w-xl">
                    <div className="mb-6 flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                        <SparklesIcon className="size-3.5" />
                        Birth chart setup
                    </div>

                    <h1 className="font-serif text-5xl leading-none text-balance sm:text-6xl">
                        Set the first point in your sky.
                    </h1>

                    <p className="mt-6 text-base leading-7 text-muted-foreground">
                        To get the most out of your daily astrology experience,
                        we need to know where to look. Adding your birth details
                        lets us save your chart and provide personal insights
                        and forecasts.
                    </p>

                    <div className="mt-10 grid gap-3">
                        <div className="grid grid-cols-[2rem_1fr] items-center gap-3">
                            <div
                                className={cn(
                                    "flex size-8 items-center justify-center border text-xs font-semibold transition-colors",
                                    {
                                        "border-foreground bg-foreground text-background":
                                            state.matches("birthday"),
                                        "border-border text-muted-foreground":
                                            !state.matches("birthday"),
                                        "border-primary bg-primary text-primary-foreground":
                                            state.hasTag("birthday-complete"),
                                    },
                                )}
                            >
                                {state.hasTag("birthday-complete") && (
                                    <CheckIcon className="size-4" />
                                )}
                                {!state.hasTag("birthday-complete") && 1}
                            </div>
                            <p
                                className={cn(
                                    "border-b border-muted text-xs font-semibold tracking-widest uppercase",
                                    {
                                        "text-foreground":
                                            state.matches("birthday"),
                                        "text-muted-foreground":
                                            !state.matches("birthday"),
                                    },
                                )}
                            >
                                Birthday
                            </p>
                        </div>

                        <div className="grid grid-cols-[2rem_1fr] items-center gap-3">
                            <div
                                className={cn(
                                    "flex size-8 items-center justify-center border text-xs font-semibold transition-colors",
                                    {
                                        "border-foreground bg-foreground text-background":
                                            state.matches("birthplace"),
                                        "border-border text-muted-foreground":
                                            !state.matches("birthplace"),
                                        "border-primary bg-primary text-primary-foreground":
                                            state.hasTag("birthplace-complete"),
                                    },
                                )}
                            >
                                {state.hasTag("birthplace-complete") && (
                                    <CheckIcon className="size-4" />
                                )}
                                {!state.hasTag("birthplace-complete") && 2}
                            </div>
                            <p
                                className={cn(
                                    "border-b border-muted text-xs font-semibold tracking-widest uppercase",
                                    {
                                        "text-foreground":
                                            state.matches("birthplace"),
                                        "text-muted-foreground":
                                            !state.matches("birthplace"),
                                    },
                                )}
                            >
                                Birthplace
                            </p>
                        </div>

                        <div className="grid grid-cols-[2rem_1fr] items-center gap-3">
                            <div
                                className={cn(
                                    "flex size-8 items-center justify-center border text-xs font-semibold transition-colors",
                                    {
                                        "border-foreground bg-foreground text-background":
                                            state.matches("confirm"),
                                        "border-border text-muted-foreground":
                                            !state.matches("confirm"),
                                        "border-primary bg-primary text-primary-foreground":
                                            user?.birthChart,
                                    },
                                )}
                            >
                                {user?.birthChart && (
                                    <CheckIcon className="size-4" />
                                )}
                                {!user?.birthChart && 3}
                            </div>
                            <p
                                className={cn(
                                    "border-b border-muted text-xs font-semibold tracking-widest uppercase",
                                    {
                                        "text-foreground":
                                            state.matches("confirm"),
                                        "text-muted-foreground":
                                            !state.matches("confirm"),
                                    },
                                )}
                            >
                                Chart
                            </p>
                        </div>
                    </div>
                </section>

                {user && (
                    <AnimatePresence mode="wait">
                        {state.matches("birthday") && (
                            <OnboardingBirthday
                                key="birthday"
                                next={() => send({ type: "NEXT" })}
                            />
                        )}
                        {state.matches("birthplace") && (
                            <OnboardingBirthLocation
                                key="birthplace"
                                back={() => send({ type: "BACK" })}
                                next={() => send({ type: "NEXT" })}
                            />
                        )}
                        {state.matches("confirm") && (
                            <OnboardingConfirm
                                key="complete"
                                back={() => send({ type: "BACK" })}
                            />
                        )}
                    </AnimatePresence>
                )}
            </div>
        </main>
    );
}
