import { desc } from "drizzle-orm";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useRemarkSync } from "react-remark";
import lumynIcon from "~public/avatars/lumyn.png";

import { db, glanceArticles } from "@/db";
import { populateMetadata } from "@/lib/populateMetadata";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
    const articles = await db.query.glanceArticles.findMany({
        orderBy: [desc(glanceArticles.createdAt)],
        limit: 5,
    });

    if (!articles || articles.length === 0) {
        return [];
    }

    return articles.map((article) => ({
        id: article.publicId,
    }));
}

export async function generateMetadata(
    {
        params,
    }: {
        params: Promise<{ id: string }>;
    },
    parent: ResolvingMetadata,
) {
    const { id } = await params;

    const article = await db.query.glanceArticles.findFirst({
        where: (glanceArticles, { eq }) => eq(glanceArticles.publicId, id),
    });

    if (!article) {
        return (await parent) as Metadata;
    }

    return populateMetadata(
        {
            title: article.title + " - Orbithm Blog",
            description: article.content.split("\n")[2],
        },
        {
            openGraph: {
                type: "article",
                publishedTime: article.createdAt.toISOString(),
                modifiedTime: article.updatedAt?.toISOString() ?? undefined,
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${article.publicId}`,
                authors: "Lumyn",
                tags: [
                    "orbithm",
                    "astrology",
                    "weekly glance",
                    "weekly transits",
                    "horoscope",
                    "lumyn",
                ],
            },
        },
    );
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const article = await db.query.glanceArticles.findFirst({
        where: (glanceArticles, { eq }) => eq(glanceArticles.publicId, id),
    });

    if (!article) {
        notFound();
        return null;
    }

    return (
        <main className="flex w-full max-w-2xl flex-col items-center gap-4 p-4">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <Image
                        src={lumynIcon}
                        alt="Lumyn"
                        className="h-7 w-7 rounded-full"
                    />
                    <p className="text-sm text-gray-300">by Lumyn</p>
                    <p className="rounded bg-blue-700 px-1 text-xs text-gray-200">
                        AI
                    </p>
                </div>
                <p className="text-gray-300">•</p>
                <p className="text-sm text-gray-300">
                    {new Date(article.createdAt).toLocaleDateString("en-GB", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
            </div>

            <div className="prose prose-invert prose-sm w-full">
                {/* this is not a hook, remark recommends this pattern */}
                {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                {useRemarkSync(article.content)}
            </div>
        </main>
    );
}
