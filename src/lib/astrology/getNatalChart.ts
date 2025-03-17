export async function getNatalChart(data: {
    birthDate: Date;
    lat: number;
    long: number;
}) {
    const params = new URLSearchParams();

    params.set("year", data.birthDate.getUTCFullYear().toString());
    params.set("month", (data.birthDate.getUTCMonth() + 1).toString());
    params.set("day", data.birthDate.getUTCDate().toString());
    params.set("hour", data.birthDate.getUTCHours().toString());
    params.set("minute", data.birthDate.getUTCMinutes().toString());

    params.set("latitude", data.lat.toString());
    params.set("longitude", data.long.toString());

    const response = await fetch(
        `https://astrocalc-api.onrender.com/birth-chart?${params.toString()}`,
    );
    return await response.json();
}
