"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/Button";

function DismissButton() {
    const router = useRouter();

    const [secondsLeft, setSecondsLeft] = useState(10);

    useEffect(() => {
        router.prefetch("/home");

        const interval = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Button
            size="sm"
            color="danger"
            disabled={secondsLeft > 0}
            className="w-fit self-end"
            onClick={() => router.push("/home")}
        >
            {secondsLeft > 0 && `(${secondsLeft}) `}I Understand
        </Button>
    );
}

export default function WarningPage() {
    return (
        <AnimatePresence>
            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.9,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                }}
                exit={{
                    opacity: 0,
                    scale: 0.9,
                }}
                className="flex h-screen items-center justify-center"
            >
                <main className="flex max-w-md flex-col gap-2 rounded-lg border border-red-800 bg-red-900 p-4 shadow-xl">
                    <h1 className="text-center text-xl font-bold text-white">
                        Warning
                    </h1>

                    <p className="text-white">
                        This site is purely for fun, don&apos;t take it too
                        seriously. If you want to keep up to date with astrology
                        from real astrologers, here is a list of some I trust:
                    </p>

                    <ul className="list-inside list-disc text-white">
                        <li>
                            Valkyrja Vörðr -{" "}
                            <a
                                href="https://substack.com/@vordr"
                                className="text-blue-400 hover:underline"
                            >
                                Substack
                            </a>
                            {", "}
                            <a
                                href="https://tiktok.com/@vordr.art"
                                className="text-blue-400 hover:underline"
                            >
                                TikTok
                            </a>
                        </li>
                        <li>
                            Spirit of Tali -{" "}
                            <a
                                href="https://spiritoftali.substack.com/"
                                className="text-blue-400 hover:underline"
                            >
                                Substack (paid)
                            </a>
                        </li>
                        <li>
                            Amy Demure -{" "}
                            <a
                                href="https://tiktok.com/@amydemure"
                                className="text-blue-400 hover:underline"
                            >
                                TikTok
                            </a>
                        </li>
                    </ul>

                    <p className="text-white">
                        Do not enter any personal information on this site
                        besides what is required (birth date, birth location).
                        Any information you enter may be stored to give context
                        to your future horoscopes, but it will never be shared
                        with anyone.
                    </p>

                    <DismissButton />
                </main>
            </motion.div>
        </AnimatePresence>
    );
}
