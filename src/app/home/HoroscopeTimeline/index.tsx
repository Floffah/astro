import { DateSelector } from "@/app/home/HoroscopeTimeline/DateSelector";
import { HoroscopeContent } from "@/app/home/HoroscopeTimeline/HoroscopeContent";
import { getSessionFromRuntime } from "@/lib/data/getSession";

export async function HoroscopeTimeline() {
    const { user } = await getSessionFromRuntime();

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <DateSelector isPremium={!!user!.premium} />

            <HoroscopeContent />
        </div>
    );
}
