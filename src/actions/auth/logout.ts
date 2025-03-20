"use server";

import { cookies as nextCookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_TOKEN } from "@/lib/constants";

export async function logout() {
    const cookies = await nextCookies();

    cookies.delete(SESSION_TOKEN);

    redirect("/");
}
