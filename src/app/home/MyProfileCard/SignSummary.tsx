"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Remark } from "react-remark";

export function SignSummary({
    handler,
}: {
    handler: () => Promise<{ error: null | string; content: null | string }>;
}) {
    const sunSignSummaryQuery = useSuspenseQuery({
        queryKey: ["getSunSignSummary"],
        queryFn: () => handler(),
    });

    return (
        <div className="prose prose-invert prose-sm w-full">
            {sunSignSummaryQuery.data.error && (
                <p className="text-red-400">
                    Could not generate summary: {sunSignSummaryQuery.data.error}
                </p>
            )}

            {sunSignSummaryQuery.data.content && (
                <Remark>{sunSignSummaryQuery.data.content}</Remark>
            )}
        </div>
    );
}
