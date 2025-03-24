import { Instrumentation } from "next";

export async function register() {
    // noop
}

export const onRequestError: Instrumentation.onRequestError = async (
    err,
    request,
    context,
) => {
    if (
        process.env.NEXT_RUNTIME === "nodejs" ||
        process.env.NEXT_RUNTIME === "edge"
    ) {
        const serverInstrumentation = await import("./instrumentation.server");

        await serverInstrumentation.onRequestError(err, request, context);
    }
};
