import { SchemaCalculateDailyTransitsResponse } from "~types/apis/astrocalc";

import { astrologyApiBaseUrl } from "@/lib/astrology/api";

export async function getDailyTransits(data: {
    birthDate?: Date;
    transitDate: Date;
    birthLat?: number;
    birthLong?: number;
    transitLat: number;
    transitLong: number;
}) {
    const params = new URLSearchParams();

    if (data.birthDate) {
        params.set("birthYear", data.birthDate.getUTCFullYear().toString());
        params.set("birthMonth", (data.birthDate.getUTCMonth() + 1).toString());
        params.set("birthDay", data.birthDate.getUTCDate().toString());
        params.set("birthHour", data.birthDate.getUTCHours().toString());
        params.set("birthMinute", data.birthDate.getUTCMinutes().toString());
    }

    params.set("transitYear", data.transitDate.getUTCFullYear().toString());
    params.set("transitMonth", (data.transitDate.getUTCMonth() + 1).toString());
    params.set("transitDay", data.transitDate.getUTCDate().toString());

    if (data.birthLat && data.birthLong) {
        params.set("birthLatitude", data.birthLat.toString());
        params.set("birthLongitude", data.birthLong.toString());
    }

    params.set("transitLatitude", data.transitLat.toString());
    params.set("transitLongitude", data.transitLong.toString());

    const response = await fetch(
        `${astrologyApiBaseUrl}/daily-transits?${params.toString()}`,
    );

    return await response
        .json()
        .then((body) => body.data as SchemaCalculateDailyTransitsResponse);
}
