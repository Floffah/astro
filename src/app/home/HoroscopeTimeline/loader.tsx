import { DateSelector } from "@/app/home/HoroscopeTimeline/DateSelector";
import { TextSkeletonLoader } from "@/components/TextSkeletonLoader";

export function HoroscopeTimelineLoader() {
    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <DateSelector isPremium={false} />

            <TextSkeletonLoader className="w-full max-w-lg" />
        </div>
    );
}
