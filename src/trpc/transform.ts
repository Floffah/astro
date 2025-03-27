import { User, UserSession } from "@/db";

export async function createTransformer(
    ctx: {
        session?: UserSession;
    } = {},
) {
    return {
        user: ({ publicId, ...user }: User) => {
            const meOnly = <T>(value: T) =>
                ctx.session?.userId === user.id ? value : null;

            return {
                ...user,
                id: publicId,
                email: meOnly(user.email),
                birthLatitude: meOnly(user.birthLatitude),
                birthLongitude: meOnly(user.birthLongitude),
                birthTimestamp: meOnly(user.birthTimestamp),
                cachedNatalPlanetPositions: null,
                summary: null,
                sunSignSummary: null,
                moonSignSummary: null,
                ascendantSignSummary: null,
            };
        },
    };
}

export type Transformer = Awaited<ReturnType<typeof createTransformer>>;

export type UserAPIModel = ReturnType<Transformer["user"]>;
