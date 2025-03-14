import { cookies as nextCookies } from "next/headers";
import { cache } from "react";

import { db } from "@/db";
import { SESSION_TOKEN } from "@/lib/constants";

export async function getSession(token: string) {
    const session = await db.query.userSessions.findFirst({
        where: (session, { eq }) => eq(session.token, token),
    });

    if (!session) {
        return {
            user: null,
            session: null,
        };
    }

    const user = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, session.userId),
    });

    if (!user) {
        return {
            user: null,
            session: null,
        };
    }

    return {
        user,
        session,
    };
}

export const getSessionFromRuntime = cache(async () => {
    const cookies = await nextCookies();

    if (!cookies.has(SESSION_TOKEN)) {
        return {
            user: null,
            session: null,
        };
    }

    const token = cookies.get(SESSION_TOKEN)!;

    return getSession(token.value);
});
