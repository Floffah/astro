import { SchemaCalculateGenericTransitChartResponse } from "~types/apis/astrocalc";

import { astrologyApiBaseUrl } from "@/lib/astrology/api";

export async function getGenericTransits(data: { date: Date }) {
    const params = new URLSearchParams();

    params.set("year", data.date.getUTCFullYear().toString());
    params.set("month", (data.date.getUTCMonth() + 1).toString());
    params.set("day", data.date.getUTCDate().toString());
    params.set("hour", data.date.getUTCHours().toString());
    params.set("minute", data.date.getUTCMinutes().toString());

    const response = await fetch(
        `${astrologyApiBaseUrl}/generic-chart?${params.toString()}`,
    );

    return await response
        .json()
        .then(
            (body) => body.data as SchemaCalculateGenericTransitChartResponse,
        );
}
