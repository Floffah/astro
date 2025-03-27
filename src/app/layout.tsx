import clsx from "clsx";
import { Geist, Geist_Mono } from "next/font/google";
import { PropsWithChildren } from "react";

import { populateMetadata } from "@/lib/populateMetadata";
import { APIProvider } from "@/providers/APIProvider";
import { DialogProvider } from "@/providers/DialogProvider";
import { PostHogProvider } from "@/providers/PostHog";

import "./globals.css";

const sansFont = Geist({
    variable: "--app-font-sans",
    subsets: ["latin"],
});

const monoFont = Geist_Mono({
    variable: "--app-font-mono",
    subsets: ["latin"],
});

export const metadata = populateMetadata({
    title: "Astrofloff",
    description: "Zodiac Academy inspired Astrology App",
});

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en" className={clsx(sansFont.variable, monoFont.variable)}>
            <body className="bg-gray-950 antialiased">
                <APIProvider>
                    <PostHogProvider>
                        <DialogProvider>{children}</DialogProvider>
                    </PostHogProvider>
                </APIProvider>
            </body>
        </html>
    );
}
