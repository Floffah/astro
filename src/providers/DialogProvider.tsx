"use client";

import clsx from "clsx";
import { nanoid } from "nanoid";
import {
    ComponentProps,
    ElementType,
    PropsWithChildren,
    ReactElement,
    cloneElement,
    createContext,
    createElement,
    isValidElement,
    useContext,
    useRef,
    useState,
} from "react";

import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { Dialog, DialogRef } from "@/components/Dialog";

interface DialogInstance {
    id: string;
    element: ReactElement | ElementType;
}

interface DialogContext {
    open: (instance: DialogInstance["element"]) => void;

    showConfirmation(
        opts: Omit<ComponentProps<typeof ConfirmationDialog>, "onConfirm"> & {
            onConfirm?: ComponentProps<typeof ConfirmationDialog>["onConfirm"];
        },
    ): Promise<boolean>;

    close: () => void;
}

export const DialogContext = createContext<DialogContext>(null!);

export const useDialogs = () => useContext(DialogContext);

export function DialogProvider({ children }: PropsWithChildren) {
    "use client";

    const [dialogs, setDialogs] = useState<DialogInstance[]>([]);
    const refs = useRef(new Map<string, DialogRef>());

    const [activeDialog, setActiveDialog] = useState<string>();

    const open: DialogContext["open"] = (instance) => {
        const id = nanoid();

        setDialogs((dialogs) => [...dialogs, { id, element: instance }]);
        setActiveDialog(id);
    };

    const showConfirmation: DialogContext["showConfirmation"] = async (
        opts,
    ) => {
        return new Promise<boolean>((resolve) => {
            open(
                <ConfirmationDialog
                    {...opts}
                    className={clsx(opts.className, {
                        "max-w-sm": !opts.className?.includes("max-w-"),
                    })}
                    onConfirm={async () => {
                        if (opts.onConfirm) {
                            await opts.onConfirm();
                        }

                        resolve(true);
                    }}
                    onCancel={async () => {
                        if (opts.onCancel) {
                            opts.onCancel();
                        }

                        resolve(false);
                    }}
                />,
            );
        });
    };

    const close: DialogContext["close"] = () => {
        setActiveDialog(undefined);
    };

    return (
        <DialogContext.Provider
            value={{
                open,
                showConfirmation,
                close,
            }}
        >
            <Dialog open={!!activeDialog}>
                <Dialog.Overlay className="z-0" />
            </Dialog>

            {dialogs.map(({ id, element }) => {
                const props = isValidElement(element)
                    ? (element.props as any)
                    : {};

                return cloneElement(
                    isValidElement(element)
                        ? element
                        : createElement(element as ElementType),
                    {
                        key: id,
                        open: activeDialog === id,
                        ref: (ref: DialogRef) => {
                            refs.current.set(id, ref);
                        },
                        standalone: false,
                        portal: true,
                        className: clsx(props.className, "z-10"),
                        onOpenChange: (open) => {
                            if (!open) {
                                const lastDialog = dialogs[dialogs.length - 2];

                                if (lastDialog) {
                                    setActiveDialog(lastDialog.id);
                                } else {
                                    setActiveDialog(undefined);
                                }
                            }

                            props.onOpenChange?.(open);
                        },
                        onAfterOpenChange: (open) => {
                            if (!open) {
                                refs.current.delete(id);
                                setDialogs((dialogs) =>
                                    dialogs.filter(
                                        (dialog) => dialog.id !== id,
                                    ),
                                );
                            }

                            props.onAfterOpenChange?.(open);
                        },
                    } as Partial<ComponentProps<typeof Dialog>>,
                );
            })}

            {children}
        </DialogContext.Provider>
    );
}
