import HomeWeeklyReadings from "@/components/blocks/HomeWeeklyReadings";
import Navbar from "@/components/blocks/Navbar";

export default function HomePage() {
    return (
        <main className="flex min-h-svh flex-col bg-background text-foreground">
            <Navbar />

            <section className="mx-auto flex w-full max-w-6xl flex-1 px-5 py-12 sm:px-8 lg:px-10">
                <HomeWeeklyReadings />
            </section>
        </main>
    );
}
