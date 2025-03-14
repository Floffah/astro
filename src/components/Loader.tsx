"use client";

import clsx from "clsx";
import { LoaderCircleIcon } from "lucide-react";
import { ComponentProps, forwardRef } from "react";

import { Icon } from "@/components/Icon";

export const Loader = forwardRef<
    SVGSVGElement,
    Omit<ComponentProps<typeof LoaderCircleIcon>, "ref" | "label" | "icon">
>(({ className, ...props }, ref) => {
    return (
        <Icon label="loading">
            <LoaderCircleIcon
                ref={ref}
                className={clsx("animate-spin", className)}
                {...props}
            />
        </Icon>
    );
});
