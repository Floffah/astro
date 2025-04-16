import { desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import lumynIcon from "~public/avatars/lumyn.png";

import { db, glanceArticles } from "@/db";
import { populateMetadata } from "@/lib/populateMetadata";

export const metadata = populateMetadata({
    title: "Orbithm Blog",
    description:
        "Read the latest articles about astrology, horoscopes, and AI-generated insights.",
});

export default async function BlogPage() {
    const articles = await db.query.glanceArticles.findMany({
        orderBy: [desc(glanceArticles.createdAt)],
        limit: 5,
    });

    if (!articles || articles.length === 0) {
        return (
            <main className="flex w-full flex-col items-center gap-4 p-4">
                <h1 className="text-2xl font-bold">No articles found</h1>
            </main>
        );
    }

    const bannerArticle = articles[0];
    const bannerArticleIntro = bannerArticle.content.split("\n")[2];

    return (
        <main className="flex w-full max-w-xl flex-col items-center gap-4 p-4">
            <h1 className="text-center text-2xl font-bold text-white">
                Latest Article
            </h1>
            <Link
                className="flex flex-col gap-1 rounded-md border border-gray-800 p-2"
                href={`/blog/${bannerArticle.publicId}`}
            >
                <p className="text-xl font-bold text-white">
                    {bannerArticle.title}
                </p>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Image
                            src={lumynIcon}
                            alt="Lumyn"
                            className="h-5 w-5 rounded-full"
                        />
                        <p className="text-xs text-gray-300">by Lumyn</p>
                    </div>
                    <p className="text-gray-300">•</p>
                    <p className="text-xs text-gray-300">
                        {new Date(bannerArticle.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            },
                        )}
                    </p>
                </div>

                <p className="text-sm text-gray-300">
                    {bannerArticleIntro.substring(0, 200)}...
                </p>
            </Link>

            <h1 className="text-center text-xl font-bold text-white">
                Previous Articles
            </h1>

            <div className="flex w-full flex-col gap-2">
                {articles.slice(1).map((article) => {
                    const intro = article.content.split("\n")[2];

                    return (
                        <Link
                            key={article.id}
                            className="flex flex-col gap-1 rounded-md border border-gray-800 p-2"
                            href={`/blog/${article.publicId}`}
                        >
                            <div className="flex items-start gap-2">
                                <p className="text-lg font-bold text-gray-300">
                                    {article.title}
                                </p>

                                <div className="flex flex-shrink-0 items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <Image
                                            src={lumynIcon}
                                            alt="Lumyn"
                                            className="h-5 w-5 rounded-full"
                                        />
                                        <p className="text-xs text-gray-300">
                                            by Lumyn
                                        </p>
                                    </div>
                                    <p className="text-gray-300">•</p>
                                    <p className="text-xs text-gray-300">
                                        {new Date(
                                            bannerArticle.createdAt,
                                        ).toLocaleDateString("en-GB", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400">
                                {intro.substring(0, 100)}...
                            </p>
                        </Link>
                    );
                })}
            </div>
        </main>
    );
}
