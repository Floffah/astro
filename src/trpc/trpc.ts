import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";

import { User, UserSession } from "@/db";
import { AuthError } from "@/lib/errors/AuthError";
import { TRPCContext } from "@/trpc/createTRPCContext";

const t = initTRPC.context<TRPCContext>().create({
    transformer: superjson,
});

export const createCallerFactory = t.createCallerFactory;

export const router = t.router;

export const procedure = t.procedure;

export const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.session) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: AuthError.UNAUTHORIZED,
        });
    }

    return next({
        ctx: ctx as TRPCContext & {
            session: UserSession;
            user: User;
        },
    });
});
