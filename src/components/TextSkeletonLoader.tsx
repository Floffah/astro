import clsx from "clsx";
import { ComponentPropsWithRef } from "react";

export function TextSkeletonLoader({
    className,
    ...props
}: ComponentPropsWithRef<"div">) {
    return (
        <div
            {...props}
            className={clsx(
                "relative flex flex-grow flex-col gap-2",
                className,
            )}
        >
            <div className="h-4 w-full animate-pulse rounded bg-gray-700" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-700" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-700" />
            <div className="h-4 w-7/12 animate-pulse rounded bg-gray-700" />
        </div>
    );
}
