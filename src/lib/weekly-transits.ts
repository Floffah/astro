import type {
    SchemaAspect,
    SchemaCalculateTransitRangeResponse,
    SchemaMoonEventObject,
    SchemaPlanet,
    SchemaRangeIngressObject,
    SchemaRangeRetrogradeObject,
    SchemaTransitNatalRangeEventObject,
    SchemaTransitTransitRangeEventObject,
    SchemaZodiacSign,
    operations,
} from "@/types/apis/astrocalc";

import { astrocalc } from "./astrocalc";

type Nullable<T> = T | null;

export type TransitRangeParams =
    operations["calculateTransitRange"]["parameters"]["query"];
export type TransitRangeResponse = SchemaCalculateTransitRangeResponse;
export type TransitNatalRangeEvent = SchemaTransitNatalRangeEventObject;
export type TransitTransitRangeEvent = SchemaTransitTransitRangeEventObject;
export type RangeIngress = SchemaRangeIngressObject;
export type RangeRetrograde = SchemaRangeRetrogradeObject;
export type MoonEvent = SchemaMoonEventObject;

export type ReadingSection = "overall" | "love" | "family" | "friends" | "work";

export type CuratedTransitEvent = {
    id: string;
    source: "transit-natal" | "transit-transit";
    rank: number;
    importance: number;
    aspect: SchemaAspect;
    bodies: string;
    activeFrom: string;
    activeUntil: string;
    strongestDate: string;
    exactInRange: boolean;
    minimumOrb: number;
    transitHouse: Nullable<number>;
    natalHouse: Nullable<number>;
    transitSign: SchemaZodiacSign;
    natalSign: Nullable<SchemaZodiacSign>;
    keywords: string[];
};

export type WeeklyReadingDataset = {
    range: TransitRangeResponse["range"];
    tone: TransitRangeResponse["summaryData"];
    sections: Record<
        ReadingSection,
        {
            events: CuratedTransitEvent[];
            ingresses: RangeIngress[];
            retrogrades: RangeRetrograde[];
            moonEvents: MoonEvent[];
        }
    >;
};

const sections: ReadingSection[] = [
    "overall",
    "love",
    "family",
    "friends",
    "work",
];

const sectionRules: Record<
    Exclude<ReadingSection, "overall">,
    {
        houses: number[];
        bodies: SchemaPlanet[];
    }
> = {
    love: {
        houses: [5, 7],
        bodies: ["Venus", "Mars", "Moon", "Descendant"],
    },
    family: {
        houses: [4],
        bodies: ["Moon", "Sun", "Saturn", "Nadir"],
    },
    friends: {
        houses: [11],
        bodies: ["Mercury", "Venus", "Jupiter", "Uranus", "True North Node"],
    },
    work: {
        houses: [2, 6, 10],
        bodies: ["Sun", "Mercury", "Mars", "Jupiter", "Saturn", "MidHeaven"],
    },
};

const planetKeywords: Partial<Record<SchemaPlanet, string[]>> = {
    Sun: ["identity", "visibility"],
    Moon: ["mood", "needs"],
    Mercury: ["messages", "decisions"],
    Venus: ["affection", "ease"],
    Mars: ["drive", "friction"],
    Jupiter: ["growth", "confidence"],
    Saturn: ["limits", "responsibility"],
    Uranus: ["change", "surprise"],
    Neptune: ["blur", "intuition"],
    Pluto: ["pressure", "release"],
    Ascendant: ["self-presentation"],
    Descendant: ["partnership"],
    MidHeaven: ["direction", "reputation"],
    Nadir: ["home", "roots"],
};

const aspectKeywords: Partial<Record<SchemaAspect, string[]>> = {
    Conjunction: ["focus", "intensity"],
    Opposition: ["tension", "balance"],
    Square: ["pressure", "action"],
    Trine: ["support", "flow"],
    Sextile: ["opening", "cooperation"],
    Quincunx: ["adjustment"],
    "Semi Square": ["irritation"],
    Sesquiquadrate: ["strain"],
};

const houseKeywords: Record<number, string[]> = {
    1: ["self"],
    2: ["money", "security"],
    4: ["home", "family"],
    5: ["romance", "pleasure"],
    6: ["workload", "health"],
    7: ["relationships"],
    10: ["work", "status"],
    11: ["friends", "community"],
    12: ["rest", "privacy"],
};

export async function fetchTransitRange(params: TransitRangeParams) {
    const response = await astrocalc.GET("/transits/range", {
        params: {
            query: params,
        },
    });

    if (response.error) {
        throw new Error(readAstrocalcError(response.error));
    }

    return response.data;
}

export function curateWeeklyReadingDataset(
    range: TransitRangeResponse,
): WeeklyReadingDataset {
    return {
        range: range.range,
        tone: range.summaryData,
        sections: Object.fromEntries(
            sections.map((section) => [
                section,
                {
                    events: pickEvents(range, section),
                    ingresses: pickIngresses(range.ingresses, section),
                    retrogrades: pickRetrogrades(range.retrogrades, section),
                    moonEvents:
                        section === "overall"
                            ? range.moonEvents
                            : range.moonEvents.slice(0, 3),
                },
            ]),
        ) as WeeklyReadingDataset["sections"],
    };
}

function pickEvents(range: TransitRangeResponse, section: ReadingSection) {
    const natal = range.transitNatalEvents.map((event) =>
        curateNatalEvent(event, section),
    );
    const sky = range.transitTransitEvents.map((event) =>
        curateSkyEvent(event, section),
    );

    return [...natal, ...sky]
        .filter((event) => event.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, section === "overall" ? 8 : 5)
        .map(toCuratedTransitEvent);
}

function toCuratedTransitEvent(
    event: CuratedTransitEvent & { score: number },
): CuratedTransitEvent {
    return {
        id: event.id,
        source: event.source,
        rank: event.rank,
        importance: event.importance,
        aspect: event.aspect,
        bodies: event.bodies,
        activeFrom: event.activeFrom,
        activeUntil: event.activeUntil,
        strongestDate: event.strongestDate,
        exactInRange: event.exactInRange,
        minimumOrb: event.minimumOrb,
        transitHouse: event.transitHouse,
        natalHouse: event.natalHouse,
        transitSign: event.transitSign,
        natalSign: event.natalSign,
        keywords: event.keywords,
    };
}

function curateNatalEvent(
    event: TransitNatalRangeEvent,
    section: ReadingSection,
) {
    return {
        id: `tn-${event.rank}`,
        source: "transit-natal" as const,
        rank: event.rank,
        importance: event.importance,
        aspect: event.aspect.name,
        bodies: `${event.transitPlanet} ${event.aspect.name} natal ${event.natalBody}`,
        activeFrom: event.activeFrom,
        activeUntil: event.activeUntil,
        strongestDate: event.minimumOrbDate,
        exactInRange: event.exactInRange,
        minimumOrb: event.minimumOrb,
        transitHouse: event.transitHouse,
        natalHouse: event.natalHouse,
        transitSign: event.transitSign,
        natalSign: event.natalSign,
        keywords: keywordsForEvent(
            [event.transitPlanet, event.natalBody],
            [event.transitHouse, event.natalHouse],
            event.aspect.name,
        ),
        score: scoreEvent(section, event.importance, {
            bodies: [event.transitPlanet, event.natalBody],
            houses: [event.transitHouse, event.natalHouse],
            exactInRange: event.exactInRange,
        }),
    };
}

function curateSkyEvent(
    event: TransitTransitRangeEvent,
    section: ReadingSection,
) {
    return {
        id: `tt-${event.rank}`,
        source: "transit-transit" as const,
        rank: event.rank,
        importance: event.importance,
        aspect: event.aspect.name,
        bodies: `${event.planet1} ${event.aspect.name} ${event.planet2}`,
        activeFrom: event.activeFrom,
        activeUntil: event.activeUntil,
        strongestDate: event.minimumOrbDate,
        exactInRange: event.exactInRange,
        minimumOrb: event.minimumOrb,
        transitHouse: event.planet1House,
        natalHouse: event.planet2House,
        transitSign: event.planet1Sign,
        natalSign: event.planet2Sign,
        keywords: keywordsForEvent(
            [event.planet1, event.planet2],
            [event.planet1House, event.planet2House],
            event.aspect.name,
        ),
        score:
            scoreEvent(section, event.importance, {
                bodies: [event.planet1, event.planet2],
                houses: [event.planet1House, event.planet2House],
                exactInRange: event.exactInRange,
            }) * 0.7,
    };
}

function scoreEvent(
    section: ReadingSection,
    importance: number,
    event: {
        bodies: SchemaPlanet[];
        houses: Nullable<number>[];
        exactInRange: boolean;
    },
) {
    if (section === "overall") {
        return importance + (event.exactInRange ? 12 : 0);
    }

    const rule = sectionRules[section];
    const houseMatches = event.houses.filter(
        (house) => house && rule.houses.includes(house),
    ).length;
    const bodyMatches = event.bodies.filter((body) =>
        rule.bodies.includes(body),
    ).length;

    if (houseMatches + bodyMatches === 0) return 0;

    return (
        importance +
        houseMatches * 28 +
        bodyMatches * 18 +
        (event.exactInRange ? 8 : 0)
    );
}

function pickIngresses(ingresses: RangeIngress[], section: ReadingSection) {
    if (section === "overall") return ingresses;
    const rule = sectionRules[section];

    return ingresses.filter(
        (ingress) =>
            rule.bodies.includes(ingress.planet) ||
            (ingress.houseAfterIngress !== null &&
                rule.houses.includes(ingress.houseAfterIngress)),
    );
}

function pickRetrogrades(
    retrogrades: RangeRetrograde[],
    section: ReadingSection,
) {
    if (section === "overall") return retrogrades;
    const rule = sectionRules[section];

    return retrogrades.filter((retrograde) =>
        rule.bodies.includes(retrograde.planet),
    );
}

function keywordsForEvent(
    bodies: SchemaPlanet[],
    houses: Nullable<number>[],
    aspect: SchemaAspect,
) {
    return [
        ...bodies.flatMap((body) => planetKeywords[body] ?? []),
        ...houses.flatMap((house) =>
            house ? (houseKeywords[house] ?? []) : [],
        ),
        ...(aspectKeywords[aspect] ?? []),
    ].filter((keyword, index, all) => all.indexOf(keyword) === index);
}

function readAstrocalcError(error: unknown) {
    if (
        typeof error === "object" &&
        error !== null &&
        "error" in error &&
        typeof error.error === "string"
    ) {
        return error.error;
    }

    return "Astrocalc request failed";
}
