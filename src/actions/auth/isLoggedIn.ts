"use server";

import { cookies as nextCookies } from "next/headers";

import { db } from "@/db";
import { SESSION_TOKEN } from "@/lib/constants";

export async function isLoggedIn() {
    const cookies = await nextCookies();

    if (!cookies.has(SESSION_TOKEN)) {
        return false;
    }

    const token = cookies.get(SESSION_TOKEN)!;

    const session = await db.query.userSessions.findFirst({
        where: (session, { eq }) => eq(session.token, token.value),
    });

    return !!session;
}
