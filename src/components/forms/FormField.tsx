import clsx from "clsx";
import { PropsWithChildren, useMemo } from "react";

import { useFieldContext } from "@/lib/useAppForm";

export interface FormFieldProps {
    label?: string;
    description?: string;
    warning?: string;

    className?: string;
}

export function FormField({
    label,
    description,
    warning,
    className,
    children,
}: PropsWithChildren<FormFieldProps>) {
    const field = useFieldContext();

    const hasError = useMemo(() => {
        return field.state.meta.errors.length > 0;
    }, [field.state.meta.errors]);

    const errorMessage = useMemo(() => {
        const error = field.state.meta.errors[0];

        if (!error || !hasError) return null;

        if (error instanceof Error) {
            return error.message;
        }

        if ("message" in error && typeof error.message === "string") {
            return error.message;
        }

        if (typeof error === "string") {
            return error;
        }

        return "An unknown error occurred.";
    }, [field.state, hasError]);

    return (
        <div className={clsx("flex flex-col gap-1", className)}>
            {label && (
                <label
                    className={clsx("text-sm font-semibold text-white/80", {
                        "!text-red-500": hasError,
                    })}
                >
                    {label}
                </label>
            )}

            {description && (
                <p
                    className={clsx("text-sm font-light", {
                        "text-red-500/80": hasError,
                        "text-white/70": !hasError,
                    })}
                >
                    {description}
                </p>
            )}

            {children}

            {warning && !hasError && (
                <p className="text-sm text-yellow-500">{warning}</p>
            )}

            {hasError && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
    );
}
