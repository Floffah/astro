"use client";

import { useQuery } from "@tanstack/react-query";
import { parse } from "cookie";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { z } from "zod";

import { Loader } from "@/components/Loader";
import { EventName } from "@/lib/analytics/EventName";
import { api } from "@/lib/api";
import { SESSION_TOKEN } from "@/lib/constants";
import { useAppForm } from "@/lib/useAppForm";
import { useLoginStore } from "@/state/loginStore";

const formSchema = z.object({
    email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export function EnterEmailForm({ onCodeSent }: { onCodeSent: () => void }) {
    const router = useRouter();
    const posthog = usePostHog();

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

    const meQuery = api.user.me.useQuery(undefined, {
        enabled: possiblyLoggedInQuery.data,
    });

    const sendCodeMutation =
        api.authentication.getVerificationCode.useMutation();

    const form = useAppForm({
        defaultValues: {
            email: "",
        } as FormValues,
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            if (possiblyLoggedInQuery.data && meQuery.isLoading) {
                return;
            }

            try {
                await sendCodeMutation.mutateAsync(value);
            } catch (e) {
                posthog.captureException(e);
                return;
            }

            posthog.capture(EventName.LOGIN_EMAIL);
            loginState.setEmail(value.email);

            onCodeSent();
        },
    });

    useEffect(() => {
        if (meQuery.data) {
            router.push("/home");
        }
    }, [meQuery.data]);

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
                                possiblyLoggedInQuery.data && meQuery.isLoading
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
                            possiblyLoggedInQuery.data && meQuery.isLoading
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
