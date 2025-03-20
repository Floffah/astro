"use client";

import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import {
    ComponentProps,
    ReactElement,
    ReactNode,
    cloneElement,
    createContext,
    forwardRef,
    useEffect,
    useState,
} from "react";

import { Icon, IconProps } from "@/components/Icon";
import { Loader } from "@/components/Loader";

export interface ButtonProps extends ComponentProps<"button"> {
    asChild?: boolean;
    size: "sm" | "md";
    color: "primary" | "secondary" | "success" | "danger";
    loading?: boolean;
    icon?: IconProps["children"];
    iconLabel?: string;
    link?: string;
}

const ButtonContext = createContext<ButtonProps>(null!);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (baseProps, ref) => {
        "use client";

        const {
            asChild,
            className,
            size = "md",
            color,
            link,
            icon,
            iconLabel,
            disabled: propsDisabled,
            loading: propsLoading,
            children: propsChildren,
            onClick,
            ...props
        } = baseProps as typeof baseProps & {
            children: ReactNode | ReactElement<any>;
        };

        const router = useRouter();

        const [loading, setLoading] = useState(false);

        const Component =
            asChild && typeof propsChildren !== "string" ? Slot : "button";
        const disabled = loading || propsDisabled;

        useEffect(() => {
            setLoading(!!propsLoading);
        }, [propsLoading]);

        useEffect(() => {
            if (link) {
                router.prefetch(link);
            }
        }, [link, router]);

        const children = (
            <>
                {loading && (
                    <Loader
                        className={clsx({
                            "opacity-60": disabled,

                            "h-4 w-4": size === "sm",
                            "h-5 w-5": size === "md",
                        })}
                    />
                )}

                {icon && !loading && (
                    <Icon size={size} label={iconLabel ?? "button"}>
                        {icon}
                    </Icon>
                )}

                <span className="flex items-center gap-2">
                    {propsChildren &&
                    typeof propsChildren === "object" &&
                    "props" in propsChildren &&
                    "children" in propsChildren.props
                        ? propsChildren.props.children
                        : propsChildren}
                </span>
            </>
        );

        return (
            <ButtonContext.Provider value={baseProps}>
                <Component
                    ref={ref as any}
                    className={clsx(
                        className,
                        "flex h-fit cursor-pointer items-center justify-center space-x-1 transition-[opacity,color,background-color] duration-150",
                        {
                            "pointer-events-none cursor-not-allowed opacity-60":
                                disabled,

                            "rounded-lg px-2 py-1 text-sm": size === "sm",
                            "rounded-lg px-3 py-1.5": size === "md",

                            "bg-blue-700 text-white": color === "primary",
                            "bg-green-700 text-white": color === "success",
                            "bg-gray-700 text-white": color === "secondary",
                            "bg-red-800 text-white": color === "danger",
                        },
                    )}
                    onClick={async (e) => {
                        setLoading(true);

                        try {
                            await onClick?.(e as any);
                        } catch (e) {
                            console.error(e);
                            setLoading(false);
                            return;
                        }

                        if (link) {
                            router.push(link);
                        } else {
                            setLoading(false);
                        }
                    }}
                    {...props}
                >
                    {asChild && typeof propsChildren !== "string"
                        ? cloneElement(propsChildren as any, {}, children)
                        : children}
                </Component>
            </ButtonContext.Provider>
        );
    },
);
