import Navbar from "@/components/blocks/Navbar";

export default function HomePage() {
    return (
        <main className="flex min-h-svh flex-col bg-background text-foreground">
            <Navbar />

            <section className="mx-auto flex w-full max-w-6xl flex-1 items-center px-5 py-16 sm:px-8 lg:px-10">
                <div className="max-w-2xl">
                    <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                        Home
                    </p>
                    <h1 className="font-serif text-5xl leading-none text-balance sm:text-6xl">
                        Your chart home is taking shape.
                    </h1>
                    <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
                        This protected page is ready for the next pass, when
                        onboarding can save your birth chart and unlock the
                        daily astrology experience.
                    </p>
                </div>
            </section>
        </main>
    );
}
