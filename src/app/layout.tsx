import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { JetBrains_Mono, Noto_Sans, Playfair_Display } from "next/font/google";
import { PropsWithChildren } from "react";

import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import "./globals.css";

const serifFont = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-serif",
});

const sansFont = Noto_Sans({
    variable: "--font-sans",
    subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Astro by Floffah",
    description:
        "A free birth chart and daily astrology readings based on your birth details.",
};

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html
            lang="en"
            className={cn(
                "h-full",
                "antialiased",
                sansFont.variable,
                monoFont.variable,
                "font-sans",
                serifFont.variable,
            )}
            suppressHydrationWarning
        >
            <body className="flex min-h-full flex-col">
                <ClerkProvider
                    appearance={{
                        theme: shadcn,
                    }}
                >
                    <ConvexClientProvider>
                        <ThemeProvider
                            attribute="class"
                            enableSystem
                            disableTransitionOnChange
                            enableColorScheme
                        >
                            <TooltipProvider>{children}</TooltipProvider>
                        </ThemeProvider>
                    </ConvexClientProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
