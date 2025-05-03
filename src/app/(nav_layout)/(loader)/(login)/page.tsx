"use client";

import { AnimatePresence, motion } from "motion/react";

import { EnterEmailForm } from "@/app/(nav_layout)/(loader)/(login)/EnterEmailForm";
import { VerifyCodeForm } from "@/app/(nav_layout)/(loader)/(login)/VerifyCodeForm";
import { useLoginStore } from "@/state/loginStore";

export default function LoginPage() {
    const loginState = useLoginStore();

    return (
        <div className="flex flex-grow items-center justify-center">
            <motion.main
                animate={{
                    scale: 1,
                    opacity: 1,
                }}
                initial={{
                    scale: 0.9,
                    opacity: 0.5,
                }}
                className="flex flex-col gap-2"
            >
                <h1 className="text-xl font-semibold text-white">Login</h1>

                <AnimatePresence mode="wait">
                    {!loginState.codeSent && (
                        <EnterEmailForm
                            onCodeSent={() => loginState.setCodeSent(true)}
                            key="enter-email-form"
                        />
                    )}

                    {loginState.codeSent && (
                        <VerifyCodeForm key="verify-email-form" />
                    )}
                </AnimatePresence>
            </motion.main>
        </div>
    );
}
