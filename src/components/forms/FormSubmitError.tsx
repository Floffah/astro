import { TRPCClientErrorLike } from "@trpc/client";
import clsx from "clsx";

export function FormSubmitError({
    error,
}: {
    error?: string | Error | TRPCClientErrorLike<any> | null;
}) {
    if (!error) {
        return null;
    }

    return (
        <p className={clsx("text-sm font-light text-red-500/80")}>
            {typeof error === "string" ? error : error.message}
        </p>
    );
}
