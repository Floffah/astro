import clsx from "clsx";
import { ComponentProps, forwardRef } from "react";

export interface InputProps extends ComponentProps<"input"> {
    hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, hasError, disabled, ...props }, ref) => {
        return (
            <input
                {...props}
                ref={ref}
                disabled={disabled}
                className={clsx(
                    className,
                    "rounded-lg border border-gray-700 bg-transparent px-2 py-1 text-white placeholder-white/40 ring-0 transition-colors duration-150 outline-none focus:ring-1 focus:ring-offset-0",
                    {
                        "focus:border-blue-600 focus:ring-blue-600":
                            !hasError && !disabled,
                        "border-red-500 focus:border-red-500 focus:ring-red-500":
                            hasError && !disabled,
                        "border-red-500/60": hasError && disabled,

                        "pointer-events-none border-gray-700/60 bg-gray-800/60 text-white/60 select-none":
                            disabled,
                    },
                )}
            ></input>
        );
    },
);
