import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db, users } from "@/db";
import { getNatalChart } from "@/lib/astrology/getNatalChart";
import { UserError } from "@/lib/errors/UserError";
import { authedProcedure, procedure, router } from "@/trpc/trpc";

export const userRouter = router({
    me: procedure.query(async ({ ctx }) => {
        if (!ctx.session) {
            return null;
        }

        const user = await db.query.users.findFirst({
            where: (users) => eq(users.id, ctx.session!.userId),
        });

        return user ? ctx.transform.user(user) : null;
    }),

    setBirthChart: authedProcedure
        .input(
            z.object({
                birthDate: z.date(),
                lat: z.number(),
                long: z.number(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            if (ctx.user.cachedNatalPlanetPositions) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: UserError.BIRTH_CHART_SET,
                });
            }

            await db
                .update(users)
                .set({
                    birthTimestamp: input.birthDate,
                    birthLatitude: input.lat,
                    birthLongitude: input.long,
                })
                .where(eq(users.id, ctx.user.id));

            const natalChart = await getNatalChart(input);

            await db
                .update(users)
                .set({
                    cachedNatalPlanetPositions: natalChart,
                    onboarded: true,
                })
                .where(eq(users.id, ctx.user.id));
        }),
});
