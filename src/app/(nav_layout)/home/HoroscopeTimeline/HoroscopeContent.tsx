"use client";

import { Suspense, useEffect } from "react";
import { Remark } from "react-remark";

import { Button } from "@/components/Button";
import { TextSkeletonLoader } from "@/components/TextSkeletonLoader";
import { api } from "@/lib/api";
import { useHoroscopeStore } from "@/state/horoscopeStore";

export function SuspenseHoroscopeContent() {
    const horoscopeState = useHoroscopeStore();

    const [content, getHoroscopeQuery] =
        api.astrology.getHoroscopeForDay.useSuspenseQuery({
            date: horoscopeState.dateSelected,
        });

    if (!content || getHoroscopeQuery.isError) {
        return (
            <p className="text-center text-gray-400">
                No horoscope available for this date.
            </p>
        );
    }

    return (
        <div className="prose prose-invert prose-sm w-full">
            <Remark>{content}</Remark>
        </div>
    );
}

export function HoroscopeContent() {
    const horoscopeState = useHoroscopeStore();

    const hasHoroscopeForDate = api.astrology.hasHoroscopeForDate.useQuery({
        date: horoscopeState.dateSelected,
    });

    useEffect(() => {
        if (hasHoroscopeForDate.data) {
            horoscopeState.setHoroscopeExpanded(true);
        }
    }, [hasHoroscopeForDate.data]);

    return (
        <div className="w-full max-w-2xl">
            {horoscopeState.horoscopeExpanded && (
                <Suspense fallback={<TextSkeletonLoader className="w-lg" />}>
                    <SuspenseHoroscopeContent
                        key={horoscopeState.dateSelected.toISOString()}
                    />
                </Suspense>
            )}

            {!horoscopeState.horoscopeExpanded && (
                <div className="flex flex-col items-center gap-2 p-4">
                    <p className="text-2xl font-bold text-white">
                        Ready for your day?
                    </p>
                    <Button
                        size="md"
                        color="primary"
                        onClick={() =>
                            horoscopeState.setHoroscopeExpanded(true)
                        }
                    >
                        Generate Horoscope
                    </Button>
                </div>
            )}
        </div>
    );
}
