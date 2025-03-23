"use client";

import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

export function LogoutButton() {
    const router = useRouter();

    const logoutMutation = api.authentication.logout.useMutation();

    return (
        <button
            onClick={async () => {
                router.prefetch("/");

                await logoutMutation.mutateAsync();

                router.push("/");
            }}
            className="cursor-pointer font-semibold text-white"
        >
            Logout
        </button>
    );
}
