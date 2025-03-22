"use client";

import { ComponentProps } from "react";

import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog";

export interface ConfirmationDialogProps
    extends Omit<ComponentProps<typeof Dialog>, "children"> {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    className?: string;
    color?: ComponentProps<typeof Button>["color"];
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void | Promise<void>;
}

export const ConfirmationDialog = ({
    title,
    description,
    cancelText,
    confirmText,
    className,
    color = "primary",
    onConfirm,
    onCancel,
    ref,
    ...props
}: ConfirmationDialogProps) => {
    return (
        <Dialog {...props} ref={ref}>
            <Dialog.Overlay />
            <Dialog.Content className={className}>
                <Dialog.Content.Title>{title}</Dialog.Content.Title>
                <Dialog.Content.Description>
                    {description}
                </Dialog.Content.Description>

                <Dialog.Content.Footer className="mt-1.5">
                    <Dialog.Content.Footer.Button
                        size="sm"
                        color="secondary"
                        onClick={async (close) => {
                            if (onCancel) {
                                await onCancel();
                            }

                            close();
                        }}
                    >
                        {cancelText ?? "Cancel"}
                    </Dialog.Content.Footer.Button>
                    <Dialog.Content.Footer.Button
                        size="sm"
                        color={color}
                        onClick={async (close) => {
                            await onConfirm();

                            close();
                        }}
                    >
                        {confirmText ?? "Confirm"}
                    </Dialog.Content.Footer.Button>
                </Dialog.Content.Footer>
            </Dialog.Content>
        </Dialog>
    );
};
