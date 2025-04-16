import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import logoImage from "@/app/icon.png";
import { LoginButton } from "@/components/blocks/NavBar/LoginButton";
import { ManageSubscriptionButton } from "@/components/blocks/NavBar/ManageSubscriptionButton";

export function NavBar() {
    return (
        <div className="flex w-full items-center justify-between border-b border-b-gray-800 px-4 py-2">
            <div className="flex items-center gap-2">
                <Image
                    src={logoImage}
                    alt="Logo"
                    className="h-10 w-10 rounded-full"
                />

                <Link href="/home" className="text-xl font-bold text-white">
                    My Atlas
                </Link>
            </div>

            <div className="flex items-center gap-4 text-gray-300">
                <Link href="/home" className="hover:underline">
                    Home
                </Link>
                <Link href="/blog" className="hover:underline">
                    Blog
                </Link>
            </div>

            <div className="flex items-center gap-2">
                <Suspense
                    fallback={
                        <p className="rounded-lg bg-gray-700 px-2 py-1 text-sm text-transparent">
                            My Subscription
                        </p>
                    }
                >
                    <ManageSubscriptionButton />
                </Suspense>

                <LoginButton />
            </div>
        </div>
    );
}
