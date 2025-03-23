import { astrologyRouter } from "@/trpc/router/astrology";
import { authenticationRouter } from "@/trpc/router/authentication";
import { userRouter } from "@/trpc/router/user";
import { router } from "@/trpc/trpc";

export const appRouter = router({
    astrology: astrologyRouter,
    authentication: authenticationRouter,
    user: userRouter,
});

export type AppRouter = typeof appRouter;
