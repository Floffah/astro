export function calculateJulianDay(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
): number {
    const Y = month > 2 ? year : year - 1;
    const M = month > 2 ? month : month + 12;
    const D = day + hour / 24 + minute / 1440 + second / 86400;

    const A = Math.floor(Y / 100);
    const B = 2 - A + Math.floor(A / 4);

    return (
        Math.floor(365.25 * (Y + 4716)) +
        Math.floor(30.6001 * (M + 1)) +
        D +
        B -
        1524.5
    );
}
