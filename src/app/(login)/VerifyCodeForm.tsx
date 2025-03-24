"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { z } from "zod";

import { EventName } from "@/lib/analytics/EventName";
import { api } from "@/lib/api";
import { useAppForm } from "@/lib/useAppForm";
import { useLoginStore } from "@/state/loginStore";

const formSchema = z.object({
    code: z.string().length(6),
});

type FormValues = z.infer<typeof formSchema>;

export function VerifyCodeForm() {
    const trpc = api.useUtils();
    const posthog = usePostHog();
    const router = useRouter();

    const loginState = useLoginStore();

    const verifyCodeMutation = api.authentication.verifyCode.useMutation();

    const form = useAppForm({
        defaultValues: {
            code: "",
        } as FormValues,
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            router.prefetch("/home");

            let result: Awaited<
                ReturnType<typeof verifyCodeMutation.mutateAsync>
            >;

            try {
                result = await verifyCodeMutation.mutateAsync({
                    code: value.code,
                    email: loginState.email,
                });
            } catch {
                posthog.capture(EventName.VERIFIED_EMAIL_FAILED);
                return;
            }

            posthog.capture(EventName.VERIFIED_EMAIL);
            await trpc.user.me.invalidate();

            if (result && !result.onboarded) {
                router.push("/onboarding");
            } else {
                router.push("/home");
            }
        },
    });

    return (
        <motion.form
            initial={{
                translateX: 20,
                opacity: 0,
            }}
            animate={{
                translateX: 0,
                opacity: 1,
            }}
            className="flex flex-col gap-2"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <form.AppForm>
                <form.AppField
                    name="code"
                    children={(field) => (
                        <field.Input
                            description="Enter the code you were sent"
                            label="Code"
                            placeholder="123456"
                        />
                    )}
                />

                <form.SubscribeButton color="primary" size="sm">
                    Login
                </form.SubscribeButton>

                <form.SubmitError error={verifyCodeMutation.error} />
            </form.AppForm>
        </motion.form>
    );
}
