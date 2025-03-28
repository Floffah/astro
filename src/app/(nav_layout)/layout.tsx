import { PropsWithChildren } from "react";

import { NavBar } from "@/components/blocks/NavBar";

export default function NavLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <NavBar />

            {children}
        </div>
    );
}
