import { TRPCError } from "@trpc/server";
import { randomInt } from "crypto";
import cryptoRandomString from "crypto-random-string";
import { addMonths } from "date-fns";
import { and, eq, lt, ne } from "drizzle-orm";
import { cookies as nextCookies } from "next/dist/server/request/cookies";
import { after } from "next/server";
import { z } from "zod";
import VerifyEmail from "~emails/verify-email";

import { db, loginRequests, userSessions, users } from "@/db";
import { SESSION_TOKEN } from "@/lib/constants";
import { AuthError } from "@/lib/errors/AuthError";
import { resend } from "@/lib/resend";
import { procedure, router } from "@/trpc/trpc";

export const authenticationRouter = router({
    getVerificationCode: procedure
        .input(
            z.object({
                email: z.string().email(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if (ctx.user && ctx.user.email === input.email) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: AuthError.ALREADY_AUTHENTICATED,
                });
            }

            const code = randomInt(100000, 999999).toString();

            after(async () => {
                await db
                    .delete(loginRequests)
                    .where(
                        and(
                            eq(loginRequests.email, input.email),
                            ne(loginRequests.code, code),
                        ),
                    );
            });

            await db.insert(loginRequests).values({
                email: input.email,
                code,
            });

            const result = await resend.emails.send({
                from: "floffah.dev <support@transactions.floffah.dev>",
                to: [input.email],
                subject: "floffah.dev verification code",
                react: <VerifyEmail verificationCode={code} />,
            });

            if (result.error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: AuthError.FAILED_TO_SEND_EMAIL,
                    cause: result.error,
                });
            }
        }),

    verifyCode: procedure
        .input(
            z.object({
                email: z.string().email(),
                code: z.string().length(6),
            }),
        )
        .mutation(async ({ input }) => {
            const loginRequest = await db.query.loginRequests.findFirst({
                where: (loginRequest, { and, eq }) =>
                    and(
                        eq(loginRequest.email, input.email),
                        eq(loginRequest.code, input.code),
                    ),
            });

            if (!loginRequest) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: AuthError.INVALID_CODE,
                });
            }

            await db
                .delete(loginRequests)
                .where(eq(loginRequests.email, input.email));

            let user = await db.query.users.findFirst({
                where: (user, { eq }) => eq(user.email, input.email),
            });

            if (!user) {
                const insertResult = await db
                    .insert(users)
                    .values({
                        email: input.email,
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
        }),

    logout: procedure.mutation(async () => {
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
    }),
});
