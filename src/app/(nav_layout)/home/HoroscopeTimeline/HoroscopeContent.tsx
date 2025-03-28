"use client";

import { Suspense } from "react";
import { Remark } from "react-remark";

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

    return (
        <div className="w-full max-w-2xl">
            <Suspense fallback={<TextSkeletonLoader />}>
                <SuspenseHoroscopeContent
                    key={horoscopeState.dateSelected.toISOString()}
                />
            </Suspense>
        </div>
    );
}
