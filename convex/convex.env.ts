import { createEnv } from "convex-env";
import { clerk, environment } from "convex-env/presets";
import { v } from "convex/values";

export const env = createEnv({
    ...environment,
    ...clerk,
    CLERK_USERS_WEBHOOK_SIGNING_SECRET: v.string(),
    CLERK_SECRET_KEY: v.string(),
});
