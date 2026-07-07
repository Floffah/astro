import { v } from "convex/values";

export const weeklyReadingSections = [
    "overall",
    "love",
    "family",
    "friends",
    "work",
] as const;

export const weeklyReadingSectionValidator = v.union(
    v.literal("overall"),
    v.literal("love"),
    v.literal("family"),
    v.literal("friends"),
    v.literal("work"),
);

export type WeeklyReadingSection = (typeof weeklyReadingSections)[number];
