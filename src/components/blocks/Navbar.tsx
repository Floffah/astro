"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function Navbar() {
    return (
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
            <p className="font-serif text-lg">Astro by Floffah</p>
            <Authenticated>
                <UserButton />
            </Authenticated>
            <Unauthenticated>
                <SignInButton mode="modal">
                    <Button variant="outline" size="sm">
                        Sign in
                    </Button>
                </SignInButton>
            </Unauthenticated>
            <AuthLoading>
                <Spinner className="size-4 text-muted-foreground" />
            </AuthLoading>
        </header>
    );
}
