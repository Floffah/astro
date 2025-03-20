"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BirthChartForm } from "@/app/onboarding/BirthChartForm";

export default function OnboardingPage() {
    const router = useRouter();

    const [horizonAnimated, setHorizonAnimated] = useState(false);
    const [wasSubmitted, setWasSubmitted] = useState(false);
    const [modalExitComplete, setModalExitComplete] = useState(false);

    return (
        <div className="relative h-screen">
            <AnimatePresence
                onExitComplete={() => router.push("/onboarding/warning")}
            >
                {!modalExitComplete && (
                    <motion.div
                        initial={{
                            translateY: 10,
                            opacity: 0.7,
                        }}
                        animate={{
                            translateY: 0,
                            opacity: 1,
                        }}
                        transition={{
                            duration: 0.5,
                        }}
                        exit={{
                            translateY: 10,
                            opacity: 0,
                        }}
                        onAnimationComplete={() => setHorizonAnimated(true)}
                        className="tp-transparent fixed top-0 left-0 z-10 h-5/12 w-full border-b border-gray-700 bg-radial-[at_40%_100%] from-gray-800"
                    />
                )}
            </AnimatePresence>

            <div className="flex h-full items-center justify-center">
                <AnimatePresence
                    onExitComplete={() => setModalExitComplete(true)}
                >
                    {horizonAnimated && !wasSubmitted && (
                        <motion.main
                            initial={{
                                scale: 0.9,
                                opacity: 0.5,
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                            }}
                            exit={{
                                scale: 0.9,
                                opacity: 0,
                            }}
                            className="z-20 flex flex-col gap-2 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-xl"
                        >
                            <h1 className="text-lg font-semibold text-white">
                                Set up your chart
                            </h1>

                            <BirthChartForm
                                onSubmitted={() => {
                                    router.prefetch("/home");
                                    setWasSubmitted(true);
                                }}
                            />
                        </motion.main>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
