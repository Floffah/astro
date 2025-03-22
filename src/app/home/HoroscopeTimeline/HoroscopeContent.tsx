"use client";

import { useQuery } from "@tanstack/react-query";
import { Remark } from "react-remark";

import { getHoroscopeForDay } from "@/actions/user/getHoroscopeForDay";
import { TextSkeletonLoader } from "@/components/TextSkeletonLoader";
import { useHoroscopeStore } from "@/state/horoscopeStore";

export function HoroscopeContent() {
    const horoscopeState = useHoroscopeStore();

    const summaryQuery = useQuery({
        queryKey: ["horoscopeSummary", horoscopeState.dateSelected],
        queryFn: () => getHoroscopeForDay(horoscopeState.dateSelected),
        networkMode: "offlineFirst",
    });

    return (
        <div className="max-w-2xl">
            {summaryQuery.isLoading && (
                <TextSkeletonLoader className="w-full max-w-lg" />
            )}

            {!summaryQuery.isLoading && !summaryQuery.data && (
                <p className="text-center text-gray-400">
                    No horoscope available for this date.
                </p>
            )}

            {summaryQuery.data && (
                <div className="prose prose-invert prose-sm w-full">
                    <Remark>{summaryQuery.data}</Remark>
                </div>
            )}
        </div>
    );
}
