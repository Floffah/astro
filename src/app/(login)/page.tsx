"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { EnterEmailForm } from "@/app/(login)/EnterEmailForm";
import { VerifyCodeForm } from "@/app/(login)/VerifyCodeForm";
import { useLoginStore } from "@/state/loginStore";

export default function LoginPage() {
    const loginState = useLoginStore();
    const [exitComplete, setExitComplete] = useState(false);

    return (
        <div className="flex h-screen items-center justify-center">
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

                <AnimatePresence onExitComplete={() => setExitComplete(true)}>
                    {!loginState.codeSent && (
                        <EnterEmailForm
                            onCodeSent={() => loginState.setCodeSent(true)}
                        />
                    )}
                </AnimatePresence>

                {loginState.codeSent && exitComplete && <VerifyCodeForm />}
            </motion.main>
        </div>
    );
}
