import { SignInButton } from "@clerk/nextjs";
import {
    ArrowRightIcon,
    ChartNoAxesCombined,
    MoonIcon,
    SparklesIcon,
} from "lucide-react";

import Navbar from "@/components/blocks/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
    return (
        <main className="min-h-svh overflow-hidden bg-background text-foreground">
            <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-10">
                <Navbar />

                <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:py-10">
                    <div className="max-w-3xl">
                        <div className="mb-6 flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                            <SparklesIcon className="size-3.5" />
                            Personal astrology with no walls
                        </div>

                        <h1 className="max-w-2xl font-serif text-5xl leading-[0.95] tracking-normal text-balance sm:text-6xl lg:text-7xl">
                            Start with the sky you were born under.
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                            Sign in to begin your personalized astrology
                            experience. Core features are free forever. See your
                            natal chart, get daily transits, and receive
                            personal summaries and readings that grow with you
                        </p>

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <SignInButton mode="modal">
                                <Button size="lg">
                                    Sign in
                                    <ArrowRightIcon data-icon="inline-end" />
                                </Button>
                            </SignInButton>

                            <p className="text-sm text-muted-foreground">
                                No credit card required
                            </p>
                        </div>
                    </div>
                    <aside className="hidden min-h-107.5 flex-col gap-6 border border-border bg-card p-6 shadow-sm lg:flex">
                        <div className="flex justify-between gap-4">
                            <div className="flex size-24 items-center justify-center border border-border bg-background">
                                <MoonIcon className="size-10 stroke-[1.4]" />
                            </div>

                            <div className="text-right">
                                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                    Today
                                </p>
                                <p className="mt-1 font-serif text-3xl">
                                    Moon first
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-2">
                            <p className="font-serif text-2xl leading-tight">
                                Your chart becomes the starting point, not the
                                whole story.
                            </p>
                            <p className="text-sm leading-6 text-muted-foreground">
                                Get daily insights that connect the dots between
                                the sky and your life, without overwhelming you
                                with technical details or jargon.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                            <ChartNoAxesCombined className="size-4" />
                            Natal chart / Daily glance / Horoscope
                        </div>
                    </aside>
                </section>
            </div>
        </main>
    );
}
