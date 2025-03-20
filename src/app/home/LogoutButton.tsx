"use client";

import { logout } from "@/actions/auth/logout";

export function LogoutButton() {
    return (
        <button
            onClick={() => logout()}
            className="cursor-pointer font-semibold text-white"
        >
            Logout
        </button>
    );
}
