import { prokeralaToken } from "@/lib/prokerala/credentials";

export async function getNatalChart(data: {
    birthDate: Date;
    lat: number;
    long: number;
}) {
    const params = new URLSearchParams();

    params.set("profile[datetime]", data.birthDate.toISOString());
    params.set("profile[coordinates]", `${data.lat},${data.long}`);

    params.set("house_system", "placidus");

    const response = await fetch(
        `https://api.prokerala.com/v2/astrology/natal-planet-position?${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${prokeralaToken}`,
            },
        },
    );
    return await response.json();
}
