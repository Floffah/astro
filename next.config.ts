import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        ppr: true,
        reactCompiler: true,
        dynamicIO: true,
    },
    serverExternalPackages: [
        "@react-email/components",
        "@react-email/tailwind",
    ],
    async rewrites() {
        return [
            {
                source: "/ingest/static/:path*",
                destination: `${process.env.NEXT_PUBLIC_POSTHOG_ASSET_HOST}/static/:path*`,
            },
            {
                source: "/ingest/:path*",
                destination: `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/:path*`,
            },
            {
                source: "/ingest/decide",
                destination: `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/decide`,
            },
        ];
    },
    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true,
};

export default nextConfig;
