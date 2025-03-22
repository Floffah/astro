"use client";

import * as RUIDialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
    ComponentProps,
    Fragment,
    MouseEvent,
    PropsWithChildren,
    ReactNode,
    Ref,
    createContext,
    startTransition,
    useContext,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";

export const DialogContentTitle = ({
    children,
    visuallyHidden,
    className,
    ...props
}: PropsWithChildren<
    { visuallyHidden?: boolean; asChild?: boolean } & Omit<
        ComponentProps<"h1">,
        "children"
    >
>) => {
    const title = (
        <RUIDialog.Title
            className={clsx(
                className,
                "text-center text-xl font-bold text-white",
            )}
            {...props}
        >
            {children}
        </RUIDialog.Title>
    );

    if (visuallyHidden) {
        return <VisuallyHidden asChild>{title}</VisuallyHidden>;
    }

    return title;
};

export const DialogContentDescription = ({
    children,
    visuallyHidden,
    className,
    ...props
}: PropsWithChildren<
    { visuallyHidden?: boolean; asChild?: boolean } & Omit<
        ComponentProps<"p">,
        "children"
    >
>) => {
    const description = (
        <RUIDialog.Description
            className={clsx(className, "text-center text-sm text-white/80")}
            {...props}
        >
            {children}
        </RUIDialog.Description>
    );

    if (visuallyHidden) {
        return <VisuallyHidden asChild>{description}</VisuallyHidden>;
    }

    return description;
};

export const DialogContentBody = ({
    children,
    className,
    ...props
}: PropsWithChildren<Omit<ComponentProps<"div">, "children">>) => {
    return (
        <div className={clsx(className, "my-2 flex-1")} {...props}>
            {children}
        </div>
    );
};

export const DialogContentFooterButton = ({
    children,
    className,
    onClick,
    ...props
}: PropsWithChildren<
    {
        onClick?: (
            close: () => void,
            event: MouseEvent<HTMLButtonElement>,
        ) => void | Promise<void>;
    } & Omit<ComponentProps<typeof Button>, "children" | "onClick">
>) => {
    const { close } = useContext(DialogContext);

    const [loading, setLoading] = useState(false);

    return (
        <Button
            className={clsx(className, "px-5")}
            loading={loading}
            onClick={async (e) => {
                if (onClick) {
                    setLoading(true);

                    await onClick(close, e);

                    setLoading(false);
                } else {
                    close();
                }
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

export const DialogContentFooter = Object.assign(
    ({
        children,
        useLessSpace = false,
        className,
        ...props
    }: PropsWithChildren<Omit<ComponentProps<"div">, "children">> & {
        useLessSpace?: boolean;
    }) => {
        return (
            <div
                className={clsx(className, "flex w-full justify-end gap-2", {
                    "*:flex-grow": !useLessSpace || Array.isArray(children),
                    "*:w-1/2": useLessSpace && !Array.isArray(children),
                })}
                {...props}
            >
                {children}
            </div>
        );
    },
    {
        Button: DialogContentFooterButton,
    },
);

export const DialogOverlay = ({
    className,
    ...props
}: Omit<
    ComponentProps<typeof motion.div>,
    "children" | "animate" | "initial" | "exit"
>) => {
    const ctx = useContext(DialogContext);

    if (!ctx.standalone) {
        return null;
    }

    const Container = ctx.portal ? RUIDialog.Portal : Fragment;

    return (
        <AnimatePresence>
            {ctx.isOpen && (
                <Container forceMount>
                    <RUIDialog.Overlay asChild forceMount>
                        <motion.div
                            {...props}
                            className={clsx(
                                className,
                                "fixed inset-0 bg-black/20",
                            )}
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                        />
                    </RUIDialog.Overlay>
                </Container>
            )}
        </AnimatePresence>
    );
};

export const DialogContent = Object.assign(
    ({
        children,
        className,
        ...props
    }: {
        children: ReactNode | ((ctx: DialogContextValue) => ReactNode);
    } & Omit<ComponentProps<typeof motion.div>, "children" | "ref">) => {
        const ctx = useContext(DialogContext);

        const Container = ctx.portal ? RUIDialog.Portal : Fragment;

        const zClasses = (className ?? "")
            .split(" ")
            .filter((c) => c.startsWith("z-"));

        return (
            <AnimatePresence
                onExitComplete={() => ctx.onAfterOpenChange?.(false)}
            >
                {ctx.isOpen && (
                    <Container forceMount>
                        <div
                            className={clsx(
                                "pointer-events-none fixed inset-0 flex max-h-screen items-center justify-center overflow-y-auto py-2",
                                zClasses,
                            )}
                        >
                            <RUIDialog.Content asChild forceMount>
                                <motion.div
                                    className={clsx(
                                        className,
                                        "pointer-events-auto relative flex h-fit max-h-full w-full flex-col gap-2 rounded-md bg-gray-800 p-4 shadow-lg",
                                    )}
                                    {...props}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.5,
                                        y: -20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.5,
                                        y: -20,
                                    }}
                                    onAnimationComplete={() =>
                                        ctx.isOpen &&
                                        ctx.onAfterOpenChange?.(true)
                                    }
                                >
                                    {ctx.closable && (
                                        <RUIDialog.Close asChild>
                                            <Icon label="close dialog">
                                                <XIcon className="absolute top-0 right-0 m-2 h-5 w-5 cursor-pointer text-gray-400" />
                                            </Icon>
                                        </RUIDialog.Close>
                                    )}

                                    {typeof children === "function"
                                        ? children(ctx)
                                        : children}
                                </motion.div>
                            </RUIDialog.Content>
                        </div>
                    </Container>
                )}
            </AnimatePresence>
        );
    },
    {
        Title: DialogContentTitle,
        Description: DialogContentDescription,
        Body: DialogContentBody,
        Footer: DialogContentFooter,
    },
);

export interface DialogRef {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

export interface DialogContextValue {
    isOpen: boolean;
    closable: boolean;
    portal?: boolean;
    standalone?: boolean; // true if called as a standalone component rather than part of the dialog provider
    open: () => void;
    close: () => void;
    onAfterOpenChange?: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue>(null!);

export const Dialog = Object.assign(
    ({
        children,
        open: propsOpen,
        closable = true,
        portal = true,
        standalone = true,
        onOpenChange,
        onAfterOpenChange,
        ref,
    }: PropsWithChildren<{
        open?: boolean;
        modal?: boolean;
        closable?: boolean;
        portal?: boolean;
        standalone?: boolean;
        onOpenChange?: (open: boolean) => void;
        onAfterOpenChange?: (open: boolean) => void;
        ref?: Ref<DialogRef>;
    }>) => {
        "use client";

        const [open, _setOpen] = useState(propsOpen ?? false);
        const setOpen = (open: boolean) =>
            startTransition(() => _setOpen(open));

        useEffect(() => {
            setOpen(propsOpen ?? false);
        }, [propsOpen]);

        useImperativeHandle(ref, () => ({
            isOpen: open,
            open: () => setOpen(true),
            close: () => setOpen(false),
        }));

        return (
            <RUIDialog.Root
                open={open}
                onOpenChange={(open) => {
                    onOpenChange?.(open);

                    if (open || closable) {
                        setOpen(open);
                    }
                }}
                defaultOpen={propsOpen === true}
                modal={true}
            >
                <DialogContext.Provider
                    value={{
                        isOpen: open,
                        closable,
                        portal,
                        standalone,
                        open: () => {
                            setOpen(true);
                            onOpenChange?.(true);
                        },
                        close: () => {
                            setOpen(false);
                            onOpenChange?.(false);
                        },
                        onAfterOpenChange,
                    }}
                >
                    {children}
                </DialogContext.Provider>
            </RUIDialog.Root>
        );
    },
    {
        Trigger: RUIDialog.Trigger,
        Overlay: DialogOverlay,
        Content: DialogContent,
    },
);
