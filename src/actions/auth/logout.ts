"use server";

import { eq } from "drizzle-orm";
import { cookies as nextCookies } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { db, userSessions } from "@/db";
import { SESSION_TOKEN } from "@/lib/constants";

export async function logout() {
    const cookies = await nextCookies();

    const token = cookies.get(SESSION_TOKEN);

    cookies.delete(SESSION_TOKEN);

    if (token) {
        after(async () => {
            await db
                .delete(userSessions)
                .where(eq(userSessions.token, token.value));
        });
    }

    redirect("/");
}
