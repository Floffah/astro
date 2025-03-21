"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { parse } from "cookie";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { isLoggedIn } from "@/actions/auth/isLoggedIn";
import { sendCode } from "@/actions/auth/sendCode";
import { Loader } from "@/components/Loader";
import { SESSION_TOKEN } from "@/lib/constants";
import { useAppForm } from "@/lib/useAppForm";
import { useLoginStore } from "@/state/loginStore";

const formSchema = z.object({
    email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export function EnterEmailForm({ onCodeSent }: { onCodeSent: () => void }) {
    const router = useRouter();

    const loginState = useLoginStore();

    const possiblyLoggedInQuery = useQuery({
        queryKey: ["possiblyLoggedIn"],
        queryFn: async () => {
            const cookie = parse(document.cookie);

            const possiblyLoggedIn = SESSION_TOKEN in cookie;

            if (possiblyLoggedIn) {
                router.prefetch("/home");
            }

            return possiblyLoggedIn;
        },
    });

    const isLoggedInQuery = useQuery({
        queryKey: ["isLoggedIn"],
        queryFn: async () => {
            const loggedIn = await isLoggedIn();

            if (loggedIn) {
                router.push("/home");
            }

            return loggedIn;
        },
        enabled: !possiblyLoggedInQuery.isLoading,
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
            if (possiblyLoggedInQuery.data && isLoggedInQuery.isLoading) {
                return;
            }

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
                            disabled={
                                possiblyLoggedInQuery.data &&
                                isLoggedInQuery.isLoading
                            }
                        />
                    )}
                </form.AppField>

                {possiblyLoggedInQuery.isLoading && (
                    <Loader className="mx-auto h-4 w-4 text-gray-400" />
                )}

                {!possiblyLoggedInQuery.isLoading && (
                    <form.SubscribeButton
                        color="primary"
                        size="sm"
                        loading={
                            possiblyLoggedInQuery.data &&
                            isLoggedInQuery.isLoading
                        }
                    >
                        Login
                    </form.SubscribeButton>
                )}

                <form.SubmitError error={sendCodeMutation.error} />
            </form.AppForm>
        </motion.form>
    );
}
