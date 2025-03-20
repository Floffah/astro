"use server";

import cryptoRandomString from "crypto-random-string";
import { addMonths } from "date-fns";
import { eq, lt } from "drizzle-orm";
import { cookies as nextCookies } from "next/headers";
import { after } from "next/server";
import { z } from "zod";

import { db, loginRequests, userSessions, users } from "@/db";
import { SESSION_TOKEN } from "@/lib/constants";

export async function verifyCode(email: string, code: string) {
    const emailParseResult = z.string().email().safeParse(email);

    if (!emailParseResult.success) {
        return {
            success: false,
            error: "Invalid email",
        };
    }

    const codeParseResult = z.string().length(6).safeParse(code);

    if (!codeParseResult.success) {
        return {
            success: false,
            error: "Invalid code",
        };
    }

    const loginRequest = await db.query.loginRequests.findFirst({
        where: (loginRequest, { and, eq }) =>
            and(eq(loginRequest.email, email), eq(loginRequest.code, code)),
    });

    if (!loginRequest) {
        return {
            success: false,
            error: "Invalid code",
        };
    }

    await db.delete(loginRequests).where(eq(loginRequests.email, email));

    let user = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.email, email),
    });

    if (!user) {
        const insertResult = await db
            .insert(users)
            .values({
                email,
            })
            .returning();

        user = insertResult[0];
    }

    const token = cryptoRandomString({ length: 64 });
    const expiresAt = addMonths(new Date(), 1);

    await db.insert(userSessions).values({
        userId: user.id,
        token,
        expiresAt,
    });

    const cookies = await nextCookies();
    cookies.set({
        name: SESSION_TOKEN,
        value: token,
        maxAge: 60 * 60 * 24 * 30,
        expires: expiresAt,
        secure: true,
    });

    after(async () => {
        await db
            .delete(userSessions)
            .where(lt(userSessions.expiresAt, new Date()));
    });

    return {
        success: true,
        user: user.id,
        onboarded: user.onboarded,
    };
}
