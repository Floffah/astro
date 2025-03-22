import Link from "next/link";

import { LogoutButton } from "@/app/home/LogoutButton";

export function NavBar() {
    return (
        <div className="flex items-center justify-between border-b border-b-gray-800 px-4 py-2">
            <Link href="/home" className="text-xl font-bold text-white">
                My Atlas
            </Link>

            <LogoutButton />
        </div>
    );
}
