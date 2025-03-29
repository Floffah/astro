"use client";

import * as Separator from "@radix-ui/react-separator";
import clsx from "clsx";
import { ComponentProps, PropsWithChildren, forwardRef } from "react";

export const Divider = forwardRef<
    HTMLDivElement,
    PropsWithChildren<Omit<ComponentProps<(typeof Separator)["Root"]>, "ref">>
>(({ children, className, orientation = "horizontal", ...props }, ref) => {
    return (
        <Separator.Root
            {...props}
            ref={ref}
            orientation={orientation}
            className={clsx(
                className,
                !!children &&
                    clsx(
                        "flex items-center gap-3 text-sm font-semibold text-black/40 before:flex-1 before:bg-black/20 after:flex-1 after:bg-black/20 dark:text-white/40 dark:before:flex-1 dark:before:bg-white/20 dark:after:flex-1 dark:after:bg-white/20",
                        {
                            "before:h-[1px] after:h-[1px]":
                                orientation === "horizontal",
                            "flex-col before:w-[1px] after:w-[1px]":
                                orientation === "vertical",
                        },
                    ),
                !children &&
                    orientation === "horizontal" &&
                    "h-[1px] w-full bg-white/20",
                !children &&
                    orientation === "vertical" &&
                    "h-full w-[1px] bg-white/20",
            )}
        >
            {children}
        </Separator.Root>
    );
});
