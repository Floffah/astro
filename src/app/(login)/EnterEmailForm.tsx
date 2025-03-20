"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { isLoggedIn } from "@/actions/auth/isLoggedIn";
import { sendCode } from "@/actions/auth/sendCode";
import { useAppForm } from "@/lib/useAppForm";
import { useLoginStore } from "@/state/loginStore";

const formSchema = z.object({
    email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export function EnterEmailForm({ onCodeSent }: { onCodeSent: () => void }) {
    const router = useRouter();

    const loginState = useLoginStore();

    useQuery({
        queryKey: ["isLoggedIn"],
        queryFn: async () => {
            router.prefetch("/home");

            const loggedIn = await isLoggedIn();

            if (loggedIn) {
                router.push("/home");
            }

            return loggedIn;
        },
    });

    const sendCodeMutation = useMutation({
        mutationKey: ["sendCode"],
        mutationFn: async (variables: { email: string }) => {
            const result = await sendCode(variables.email);

            if (result.success) {
                return true;
            } else {
                throw new Error(result.error);
            }
        },
    });

    const form = useAppForm({
        defaultValues: {
            email: "",
        } as FormValues,
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await sendCodeMutation.mutateAsync(value);
            } catch {
                return;
            }

            loginState.setEmail(value.email);

            onCodeSent();
        },
    });

    return (
        <motion.form
            initial={{
                translateX: 0,
                opacity: 1,
            }}
            exit={{
                translateX: -20,
                opacity: 0,
            }}
            className="flex flex-col gap-2"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.AppForm>
                <form.AppField name="email">
                    {(field) => (
                        <field.Input
                            description="You will be sent a verification email"
                            label="Email"
                            placeholder="you@example.com"
                        />
                    )}
                </form.AppField>

                <form.SubscribeButton color="primary" size="sm">
                    Login
                </form.SubscribeButton>

                <form.SubmitError error={sendCodeMutation.error} />
            </form.AppForm>
        </motion.form>
    );
}
