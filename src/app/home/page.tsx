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
                        Your chart is saved.
                    </h1>
                    <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
                        The next build of this page will show the chart you
                        saved, today&apos;s transits, and a short reading for
                        the day.
                    </p>
                </div>
            </section>
        </main>
    );
}
