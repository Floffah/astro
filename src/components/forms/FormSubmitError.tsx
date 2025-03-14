import clsx from "clsx";

export function FormSubmitError({ error }: { error?: string | Error | null }) {
    if (!error) {
        return null;
    }

    return (
        <p className={clsx("text-sm font-light text-red-500/80")}>
            {error instanceof Error ? error.message : error}
        </p>
    );
}
