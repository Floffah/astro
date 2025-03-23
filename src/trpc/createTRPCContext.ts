import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { parse } from "cookie";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { SESSION_TOKEN } from "@/lib/constants";
import { createTransformer } from "@/trpc/transform";

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
    const baseContext = {
        req: opts.req,
        resHeaders: opts.resHeaders,
        transform: await createTransformer(),
        session: undefined,
        user: undefined,
    };

    if (
        !opts.req.headers.has("cookie") &&
        !opts.req.headers.has("x-session-token")
    ) {
        return baseContext;
    }

    let token: string | undefined;

    if (opts.req.headers.has("x-session-token")) {
        token = opts.req.headers.get("x-session-token") as string;
    } else {
        const cookies = parse(opts.req.headers.get("cookie") as string);
        token = cookies[SESSION_TOKEN];
    }

    if (!token || !token.trim() || token.length < 10) {
        return baseContext;
    }

    const session = await db.query.userSessions.findFirst({
        where: (userSessions) => eq(userSessions.token, token),
    });

    if (!session) {
        return baseContext;
    }

    const user = await db.query.users.findFirst({
        where: (users) => eq(users.id, session.userId),
    });

    if (!user) {
        return baseContext;
    }

    // await db
    //     .update(userSessions)
    //     .set({
    //         lastUsedAt: new Date(),
    //     })
    //     .where(eq(userSessions.id, session.id));

    return {
        ...baseContext,
        session,
        user,
        transfor: await createTransformer({
            session,
        }),
    };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
