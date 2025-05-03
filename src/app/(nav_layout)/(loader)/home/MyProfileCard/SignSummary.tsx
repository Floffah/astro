"use client";

import { Remark } from "react-remark";

import { api } from "@/lib/api";

export function SignSummary({ name }: { name: "sun" | "moon" | "ascendant" }) {
    const [content, sunSignSummaryQuery] =
        api.astrology.getSignSummary.useSuspenseQuery(
            {
                sign: name,
            },
            {
                networkMode: "offlineFirst",
            },
        );

    return (
        <div className="prose prose-invert prose-sm w-full">
            {sunSignSummaryQuery.error && (
                <p className="text-red-400">
                    Could not generate summary:{" "}
                    {sunSignSummaryQuery.error.message}
                </p>
            )}

            {content && <Remark>{content}</Remark>}
        </div>
    );
}
