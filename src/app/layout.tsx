import clsx from "clsx";
import { Geist, Geist_Mono } from "next/font/google";
import { PropsWithChildren } from "react";

import { populateMetadata } from "@/lib/populateMetadata";
import { DialogProvider } from "@/providers/DialogProvider";
import { QueryClientProvider } from "@/providers/QueryClientProvider";

import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = populateMetadata({
    title: "Astrofloff",
    description: "Zodiac Academy inspired Astrology App",
});

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html
            lang="en"
            className={clsx(geistSans.variable, geistMono.variable)}
        >
            <body className="bg-gray-950 antialiased">
                <QueryClientProvider>
                    <DialogProvider>{children}</DialogProvider>
                </QueryClientProvider>
            </body>
        </html>
    );
}
