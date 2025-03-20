"use server";

import { randomInt } from "crypto";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import VerifyEmail from "~emails/verify-email";

import { db, loginRequests } from "@/db";
import { getSessionFromRuntime } from "@/lib/data/getSession";
import { resend } from "@/lib/resend";

export async function sendCode(email: string) {
    const emailParseResult = z.string().email().safeParse(email);

    if (!emailParseResult.success) {
        return {
            success: false,
            error: "Invalid email",
        };
    }

    const { user } = await getSessionFromRuntime();

    if (user && user.email === email) {
        redirect("/home");
        return {
            success: false,
            error: "Already logged in",
        };
    }

    await db.delete(loginRequests).where(eq(loginRequests.email, email));

    const code = randomInt(100000, 999999).toString();

    await db.insert(loginRequests).values({
        email,
        code,
    });

    const result = await resend.emails.send({
        from: "floffah.dev <support@transactions.floffah.dev>",
        to: [email],
        subject: "floffah.dev verification code",
        react: <VerifyEmail verificationCode={code} />,
    });

    if (result.error) {
        return {
            success: false,
            error: result.error.message,
        };
    }

    return {
        success: true,
    };
}
