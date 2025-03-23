import { User, UserSession } from "@/db";

export async function createTransformer(
    ctx: {
        session?: UserSession;
    } = {},
) {
    return {
        user: ({ publicId, ...user }: User) => ({
            ...user,
            id: publicId,
            email: ctx.session?.userId === user.id ? user.email : null,
        }),
    };
}

export type Transformer = Awaited<ReturnType<typeof createTransformer>>;

export type UserAPIModel = ReturnType<Transformer["user"]>;
